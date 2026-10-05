import {
  KitchenStationModel,
  KitchenStationDocument,
  KitchenOrderModel,
  KitchenOrderDocument,
  KitchenItemModel,
  KitchenItemDocument,
} from './kitchen.model.js';
import { IKitchenStation, IKitchenOrder, IKitchenItem } from './kitchen.types.js';

export class KitchenRepository {
  // STATIONS
  async createStation(data: Partial<IKitchenStation>): Promise<KitchenStationDocument> {
    return KitchenStationModel.create(data);
  }

  async findStations(restaurantId: string): Promise<KitchenStationDocument[]> {
    return KitchenStationModel.find({ restaurantId, active: true }).sort({ displayOrder: 1 });
  }

  async findStationById(stationId: string, restaurantId: string): Promise<KitchenStationDocument | null> {
    return KitchenStationModel.findOne({ stationId, restaurantId });
  }

  async updateStation(
    stationId: string,
    restaurantId: string,
    updateData: Partial<IKitchenStation>
  ): Promise<KitchenStationDocument | null> {
    return KitchenStationModel.findOneAndUpdate({ stationId, restaurantId }, updateData, { new: true });
  }

  async deleteStation(stationId: string, restaurantId: string): Promise<boolean> {
    const res = await KitchenStationModel.deleteOne({ stationId, restaurantId });
    return res.deletedCount > 0;
  }

  // KITCHEN ORDERS & QUEUE
  async createKitchenOrder(data: Partial<IKitchenOrder>): Promise<KitchenOrderDocument> {
    return KitchenOrderModel.create(data);
  }

  async findKitchenOrderById(orderId: string, restaurantId: string): Promise<KitchenOrderDocument | null> {
    return KitchenOrderModel.findOne({ orderId, restaurantId });
  }

  async findKitchenQueue(restaurantId: string): Promise<KitchenOrderDocument[]> {
    return KitchenOrderModel.find({
      restaurantId,
      status: { $in: ['QUEUED', 'PREPARING'] },
    }).sort({ priority: -1, createdAt: 1 });
  }

  async updateKitchenOrder(
    orderId: string,
    restaurantId: string,
    updateData: Partial<IKitchenOrder>
  ): Promise<KitchenOrderDocument | null> {
    return KitchenOrderModel.findOneAndUpdate({ orderId, restaurantId }, updateData, { new: true });
  }

  // KITCHEN ITEMS
  async createKitchenItem(data: Partial<IKitchenItem>): Promise<KitchenItemDocument> {
    return KitchenItemModel.create(data);
  }

  async findKitchenItems(orderId: string, restaurantId: string): Promise<KitchenItemDocument[]> {
    return KitchenItemModel.find({ orderId, restaurantId });
  }

  async findKitchenItemById(itemId: string, orderId: string, restaurantId: string): Promise<KitchenItemDocument | null> {
    return KitchenItemModel.findOne({ kitchenItemId: itemId, orderId, restaurantId });
  }

  async updateKitchenItem(
    itemId: string,
    orderId: string,
    restaurantId: string,
    updateData: Partial<IKitchenItem>
  ): Promise<KitchenItemDocument | null> {
    return KitchenItemModel.findOneAndUpdate({ kitchenItemId: itemId, orderId, restaurantId }, updateData, { new: true });
  }
}

export const kitchenRepository = new KitchenRepository();
