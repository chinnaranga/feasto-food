import { restaurantOperationsRepository } from './restaurantOperations.repository.js';
import { Order } from '../orders/orders.model.js';
import { socketGateway } from '../../config/socket.js';
import { notificationsService } from '../notifications/notifications.service.js';
import {
  IRestaurantOperations,
  IOrderPreparationEvent,
  IOrderDelay,
} from './restaurantOperations.types.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { generateEventId } from '../notifications/notifications.utils.js';

export class RestaurantOperationsService {
  // 1. INCOMING & ACTIVE ORDERS
  async getIncomingOrders(restaurantId: string): Promise<any[]> {
    return Order.find({
      restaurantId,
      orderStatus: 'placed',
    }).sort({ createdAt: -1 });
  }

  async getActiveOrders(restaurantId: string): Promise<any[]> {
    return Order.find({
      restaurantId,
      orderStatus: { $in: ['placed', 'accepted', 'preparing', 'ready'] },
    }).sort({ createdAt: -1 });
  }

  async getOrderDetails(restaurantId: string, orderId: string): Promise<any> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found for restaurant ${restaurantId}`);
    return order;
  }

  // 2. ACCEPT / REJECT ORDER
  async acceptOrder(
    restaurantId: string,
    orderId: string,
    data: { estimatedPreparationTimeMinutes?: number; notes?: string },
    actorId: string
  ): Promise<any> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    if (order.orderStatus !== 'placed') {
      throw new BadRequestError(`Cannot accept order in status '${order.orderStatus}'`);
    }

    // Check if restaurant is paused or closed
    const statusDoc = await this.getOperationalStatus(restaurantId);
    if (['CLOSED', 'PAUSED', 'TEMPORARILY_UNAVAILABLE'].includes(statusDoc.status)) {
      throw new BadRequestError(`Restaurant is currently ${statusDoc.status}. Cannot accept new orders.`);
    }

    order.orderStatus = 'accepted';
    await order.save();

    const eventId = generateEventId();
    await restaurantOperationsRepository.createPreparationEvent({
      eventId,
      orderId,
      restaurantId,
      previousSubState: 'WAITING_FOR_RESTAURANT',
      newSubState: 'RESTAURANT_ACCEPTED',
      actorId,
      actorRole: 'restaurant_staff',
      notes: data.notes,
    });

    // Realtime Socket Emission
    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.accepted', {
      orderId,
      orderNumber: order.orderNumber,
      estimatedPreparationTimeMinutes: data.estimatedPreparationTimeMinutes || 20,
    });
    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.accepted', {
      orderId,
      status: 'accepted',
    });

    // Phase 9 Notification Trigger
    await notificationsService.dispatchNotificationEvent({
      type: 'ORDER_ACCEPTED',
      recipientUserId: order.customerId.toString(),
      entityType: 'order',
      entityId: orderId,
      payload: {
        orderNumber: order.orderNumber,
        restaurantName: 'Restaurant',
      },
    });

    return order;
  }

  async rejectOrder(
    restaurantId: string,
    orderId: string,
    data: { reason: string },
    actorId: string
  ): Promise<any> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    if (['delivered', 'cancelled', 'rejected'].includes(order.orderStatus)) {
      throw new BadRequestError(`Cannot reject order in status '${order.orderStatus}'`);
    }

    order.orderStatus = 'rejected';
    await order.save();

    await restaurantOperationsRepository.createPreparationEvent({
      eventId: generateEventId(),
      orderId,
      restaurantId,
      previousSubState: 'WAITING_FOR_RESTAURANT',
      newSubState: 'RESTAURANT_ACCEPTED',
      actorId,
      actorRole: 'restaurant_staff',
      notes: `Rejected: ${data.reason}`,
    });

    // Realtime Socket Emission
    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.rejected', {
      orderId,
      reason: data.reason,
    });
    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.rejected', {
      orderId,
      reason: data.reason,
    });

    // Phase 9 Notification Trigger
    await notificationsService.dispatchNotificationEvent({
      type: 'ORDER_REJECTED',
      recipientUserId: order.customerId.toString(),
      entityType: 'order',
      entityId: orderId,
      payload: {
        orderNumber: order.orderNumber,
        reason: data.reason,
      },
    });

    return order;
  }

  // 3. PREPARE & READY ORDER
  async prepareOrder(
    restaurantId: string,
    orderId: string,
    data: { notes?: string },
    actorId: string
  ): Promise<any> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    order.orderStatus = 'preparing';
    await order.save();

    await restaurantOperationsRepository.createPreparationEvent({
      eventId: generateEventId(),
      orderId,
      restaurantId,
      previousSubState: 'RESTAURANT_ACCEPTED',
      newSubState: 'PREPARING',
      actorId,
      actorRole: 'restaurant_staff',
      notes: data.notes,
    });

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.preparing', { orderId });
    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.preparing', { orderId });

    await notificationsService.dispatchNotificationEvent({
      type: 'ORDER_PREPARING',
      recipientUserId: order.customerId.toString(),
      entityType: 'order',
      entityId: orderId,
      payload: { orderNumber: order.orderNumber },
    });

    return order;
  }

  async markOrderReady(
    restaurantId: string,
    orderId: string,
    data: { notes?: string },
    actorId: string
  ): Promise<any> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    order.orderStatus = 'ready';
    await order.save();

    await restaurantOperationsRepository.createPreparationEvent({
      eventId: generateEventId(),
      orderId,
      restaurantId,
      previousSubState: 'PREPARING',
      newSubState: 'READY_FOR_PICKUP',
      actorId,
      actorRole: 'restaurant_staff',
      notes: data.notes,
    });

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.ready', { orderId });
    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.ready', { orderId });

    await notificationsService.dispatchNotificationEvent({
      type: 'ORDER_READY',
      recipientUserId: order.customerId.toString(),
      entityType: 'order',
      entityId: orderId,
      payload: { orderNumber: order.orderNumber },
    });

    return order;
  }

  // 4. DELAY MANAGEMENT
  async reportDelay(
    restaurantId: string,
    orderId: string,
    data: { reason: any; delayMinutes: number; notes?: string },
    actorId: string
  ): Promise<IOrderDelay> {
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    const delayId = `delay_${Date.now()}`;
    const delay = await restaurantOperationsRepository.createDelayReport({
      delayId,
      orderId,
      restaurantId,
      reason: data.reason,
      delayMinutes: data.delayMinutes,
      notes: data.notes,
      createdBy: actorId,
      isResolved: false,
    });

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.delayed', {
      orderId,
      delayMinutes: data.delayMinutes,
      reason: data.reason,
    });

    // Domain event -> Notification Service
    await notificationsService.dispatchNotificationEvent({
      type: 'DELIVERY_DELAYED',
      recipientUserId: order.customerId.toString(),
      entityType: 'order',
      entityId: orderId,
      payload: {
        orderNumber: order.orderNumber,
        delayMinutes: data.delayMinutes,
      },
    });

    return delay;
  }

  async getOrderTimeline(orderId: string): Promise<IOrderPreparationEvent[]> {
    return restaurantOperationsRepository.findOrderTimeline(orderId);
  }

  // 5. OPERATIONAL STATUS
  async getOperationalStatus(restaurantId: string): Promise<IRestaurantOperations> {
    let statusDoc = await restaurantOperationsRepository.findByRestaurantId(restaurantId);
    if (!statusDoc) {
      statusDoc = await restaurantOperationsRepository.upsertStatus(restaurantId, {
        restaurantId,
        status: 'OPEN',
        isPaused: false,
        avgPreparationTimeMinutes: 20,
        activeOrderCount: 0,
      });
    }
    return statusDoc;
  }

  async updateOperationalStatus(
    restaurantId: string,
    data: { status?: any; pauseReason?: string; pausedUntil?: Date },
    actorId: string
  ): Promise<IRestaurantOperations> {
    const isPaused = data.status === 'PAUSED';
    const updated = await restaurantOperationsRepository.upsertStatus(restaurantId, {
      status: data.status || 'OPEN',
      isPaused,
      pauseReason: data.pauseReason,
      pausedUntil: data.pausedUntil,
    });

    await restaurantOperationsRepository.logOperationalEvent({
      eventId: generateEventId(),
      restaurantId,
      eventType: 'RESTAURANT_STATUS_CHANGED',
      details: { newStatus: data.status },
      actorId,
    });

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'restaurant.status_changed', {
      status: data.status,
    });

    return updated;
  }
}

export const restaurantOperationsService = new RestaurantOperationsService();
