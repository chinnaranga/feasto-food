import { pickupRepository } from './pickup.repository.js';
import { Order } from '../orders/orders.model.js';
import { socketGateway } from '../../config/socket.js';
import { notificationsService } from '../notifications/notifications.service.js';
import { IPickupHandover } from './pickup.types.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';

export class PickupService {
  async getHandoffDetails(restaurantId: string, orderId: string): Promise<IPickupHandover> {
    let handover = await pickupRepository.findByOrderId(orderId, restaurantId);
    if (!handover) {
      const order = await Order.findOne({ _id: orderId, restaurantId });
      if (!order) throw new NotFoundError(`Order ${orderId} not found`);

      handover = await pickupRepository.createHandover({
        handoverId: `hnd_${Date.now()}`,
        orderId,
        restaurantId,
        status: 'WAITING_FOR_RIDER',
        isVerified: false,
      });
    }
    return handover;
  }

  async startHandoff(restaurantId: string, orderId: string, data: { riderId?: string; verificationCode?: string }): Promise<IPickupHandover> {
    let handover = await pickupRepository.findByOrderId(orderId, restaurantId);
    if (!handover) {
      handover = await this.getHandoffDetails(restaurantId, orderId);
    }

    const updated = await pickupRepository.updateHandover(orderId, restaurantId, {
      riderId: data.riderId || handover.riderId,
      status: 'HANDOFF_STARTED',
      verificationCode: data.verificationCode,
      handoffStartedAt: new Date(),
    });

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.handoff_started', { orderId });
    return updated!;
  }

  async confirmHandoff(restaurantId: string, orderId: string, data: { verificationCode?: string }): Promise<IPickupHandover> {
    const handover = await pickupRepository.findByOrderId(orderId, restaurantId);
    if (!handover) throw new NotFoundError(`Handoff record for order ${orderId} not found`);

    if (handover.verificationCode && data.verificationCode && handover.verificationCode !== data.verificationCode) {
      throw new BadRequestError('Invalid pickup verification code');
    }

    const updated = await pickupRepository.updateHandover(orderId, restaurantId, {
      status: 'COMPLETED',
      isVerified: true,
      handoffCompletedAt: new Date(),
    });

    // Update Order Model status to out_for_delivery
    const order = await Order.findOne({ _id: orderId, restaurantId });
    if (order) {
      order.orderStatus = 'out_for_delivery';
      await order.save();

      // Trigger Phase 9 Notification
      await notificationsService.dispatchNotificationEvent({
        type: 'ORDER_OUT_FOR_DELIVERY',
        recipientUserId: order.customerId.toString(),
        entityType: 'order',
        entityId: orderId,
        payload: {
          orderNumber: order.orderNumber,
          riderName: 'Delivery Rider',
          restaurantName: 'Restaurant',
        },
      });
    }

    socketGateway.emitToRoom('/restaurants', `restaurant:${restaurantId}`, 'order.picked_up', { orderId });
    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.picked_up', { orderId });

    return updated!;
  }
}

export const pickupService = new PickupService();
