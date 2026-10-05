import { kitchenRepository } from './kitchen.repository.js';
import { Order } from '../orders/orders.model.js';
import { socketGateway } from '../../config/socket.js';
import { IKitchenStation, IKitchenOrder, IKitchenItem } from './kitchen.types.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { restaurantOperationsService } from '../restaurantOperations/restaurantOperations.service.js';

export class KitchenService {
  // STATIONS
  async createStation(restaurantId: string, data: Partial<IKitchenStation>): Promise<IKitchenStation> {
    const stationId = `stn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return kitchenRepository.createStation({
      stationId,
      restaurantId,
      name: data.name,
      code: data.code,
      displayOrder: data.displayOrder || 0,
      capacity: data.capacity || 10,
      active: true,
      status: 'active',
    });
  }

  async getStations(restaurantId: string): Promise<IKitchenStation[]> {
    return kitchenRepository.findStations(restaurantId);
  }

  async updateStation(restaurantId: string, stationId: string, data: Partial<IKitchenStation>): Promise<IKitchenStation> {
    const stn = await kitchenRepository.updateStation(stationId, restaurantId, data);
    if (!stn) throw new NotFoundError(`Station ${stationId} not found`);
    return stn;
  }

  async deleteStation(restaurantId: string, stationId: string): Promise<boolean> {
    return kitchenRepository.deleteStation(stationId, restaurantId);
  }

  // QUEUE & ORDERS
  async getKitchenQueue(restaurantId: string): Promise<IKitchenOrder[]> {
    return kitchenRepository.findKitchenQueue(restaurantId);
  }

  async getKitchenOrder(restaurantId: string, orderId: string): Promise<{ order: IKitchenOrder; items: IKitchenItem[] }> {
    let kOrder = await kitchenRepository.findKitchenOrderById(orderId, restaurantId);

    // Auto sync from canonical Order model if not existing
    if (!kOrder) {
      const order = await Order.findOne({ _id: orderId, restaurantId });
      if (!order) throw new NotFoundError(`Order ${orderId} not found`);

      kOrder = await kitchenRepository.createKitchenOrder({
        kitchenOrderId: `kord_${Date.now()}`,
        orderId,
        orderNumber: order.orderNumber,
        restaurantId,
        priority: 'NORMAL',
        status: 'QUEUED',
        itemCount: order.items.length,
        completedItemCount: 0,
        estimatedPreparationTimeMinutes: 20,
        delayMinutes: 0,
      });

      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        await kitchenRepository.createKitchenItem({
          kitchenItemId: `kitem_${Date.now()}_${i}`,
          kitchenOrderId: kOrder.kitchenOrderId,
          orderId,
          restaurantId,
          itemId: item.itemId.toString(),
          itemName: item.itemName,
          quantity: item.quantity,
          variantName: item.variantName,
          addons: item.addons,
          status: 'PENDING',
        });
      }
    }

    const items = await kitchenRepository.findKitchenItems(orderId, restaurantId);
    return { order: kOrder, items };
  }

  async startKitchenOrder(restaurantId: string, orderId: string, actorId: string): Promise<IKitchenOrder> {
    const { order } = await this.getKitchenOrder(restaurantId, orderId);

    const updated = await kitchenRepository.updateKitchenOrder(orderId, restaurantId, {
      status: 'PREPARING',
      preparationStartedAt: new Date(),
    });

    // Also update order status
    await restaurantOperationsService.prepareOrder(restaurantId, orderId, {}, actorId);

    socketGateway.emitToRoom('/restaurants', `kitchen:${restaurantId}`, 'kitchen.order_started', { orderId });
    return updated!;
  }

  async updateKitchenOrder(restaurantId: string, orderId: string, data: Partial<IKitchenOrder>): Promise<IKitchenOrder> {
    const updated = await kitchenRepository.updateKitchenOrder(orderId, restaurantId, data);
    if (!updated) throw new NotFoundError(`Kitchen order ${orderId} not found`);
    return updated;
  }

  // ITEM PREPARATION WORKFLOW
  async getOrderItems(restaurantId: string, orderId: string): Promise<IKitchenItem[]> {
    const { items } = await this.getKitchenOrder(restaurantId, orderId);
    return items;
  }

  async startItemPreparation(restaurantId: string, orderId: string, itemId: string): Promise<IKitchenItem> {
    const item = await kitchenRepository.findKitchenItemById(itemId, orderId, restaurantId);
    if (!item) throw new NotFoundError(`Kitchen item ${itemId} not found`);

    const updated = await kitchenRepository.updateKitchenItem(itemId, orderId, restaurantId, {
      status: 'PREPARING',
      startedAt: new Date(),
    });

    socketGateway.emitToRoom('/restaurants', `kitchen:${restaurantId}`, 'kitchen.item_updated', {
      orderId,
      itemId,
      status: 'PREPARING',
    });

    return updated!;
  }

  async completeItemPreparation(restaurantId: string, orderId: string, itemId: string, actorId: string): Promise<IKitchenItem> {
    const item = await kitchenRepository.findKitchenItemById(itemId, orderId, restaurantId);
    if (!item) throw new NotFoundError(`Kitchen item ${itemId} not found`);

    const updated = await kitchenRepository.updateKitchenItem(itemId, orderId, restaurantId, {
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    const items = await kitchenRepository.findKitchenItems(orderId, restaurantId);
    const completedCount = items.filter((i) => i.status === 'COMPLETED').length;

    await kitchenRepository.updateKitchenOrder(orderId, restaurantId, {
      completedItemCount: completedCount,
    });

    // If all items completed -> Mark entire order ready
    if (completedCount === items.length) {
      await kitchenRepository.updateKitchenOrder(orderId, restaurantId, {
        status: 'READY',
        preparationCompletedAt: new Date(),
      });

      await restaurantOperationsService.markOrderReady(restaurantId, orderId, {}, actorId);

      socketGateway.emitToRoom('/restaurants', `kitchen:${restaurantId}`, 'kitchen.order_completed', { orderId });
    }

    return updated!;
  }
}

export const kitchenService = new KitchenService();
