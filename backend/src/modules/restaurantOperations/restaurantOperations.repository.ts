import {
  RestaurantOperationsModel,
  RestaurantOperationsDocument,
  OrderPreparationEventModel,
  OrderPreparationEventDocument,
  OrderDelayModel,
  OrderDelayDocument,
  RestaurantOperationalEventModel,
  RestaurantOperationalEventDocument,
} from './restaurantOperations.model.js';
import {
  IRestaurantOperations,
  IOrderPreparationEvent,
  IOrderDelay,
  IRestaurantOperationalEvent,
} from './restaurantOperations.types.js';

export class RestaurantOperationsRepository {
  async findByRestaurantId(restaurantId: string): Promise<RestaurantOperationsDocument | null> {
    return RestaurantOperationsModel.findOne({ restaurantId });
  }

  async upsertStatus(
    restaurantId: string,
    updateData: Partial<IRestaurantOperations>
  ): Promise<RestaurantOperationsDocument> {
    return RestaurantOperationsModel.findOneAndUpdate(
      { restaurantId },
      { $set: { ...updateData, lastStatusChangedAt: new Date() } },
      { new: true, upsert: true }
    );
  }

  async createPreparationEvent(data: Partial<IOrderPreparationEvent>): Promise<OrderPreparationEventDocument> {
    return OrderPreparationEventModel.create(data);
  }

  async findOrderTimeline(orderId: string): Promise<OrderPreparationEventDocument[]> {
    return OrderPreparationEventModel.find({ orderId }).sort({ createdAt: 1 });
  }

  async createDelayReport(data: Partial<IOrderDelay>): Promise<OrderDelayDocument> {
    return OrderDelayModel.create(data);
  }

  async findOrderDelays(orderId: string): Promise<OrderDelayDocument[]> {
    return OrderDelayModel.find({ orderId }).sort({ createdAt: -1 });
  }

  async logOperationalEvent(data: Partial<IRestaurantOperationalEvent>): Promise<RestaurantOperationalEventDocument> {
    return RestaurantOperationalEventModel.create(data);
  }
}

export const restaurantOperationsRepository = new RestaurantOperationsRepository();
