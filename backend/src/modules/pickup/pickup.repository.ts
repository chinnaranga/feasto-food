import { PickupHandoverModel, PickupHandoverDocument } from './pickup.model.js';
import { IPickupHandover } from './pickup.types.js';

export class PickupRepository {
  async findByOrderId(orderId: string, restaurantId: string): Promise<PickupHandoverDocument | null> {
    return PickupHandoverModel.findOne({ orderId, restaurantId });
  }

  async createHandover(data: Partial<IPickupHandover>): Promise<PickupHandoverDocument> {
    return PickupHandoverModel.create(data);
  }

  async updateHandover(
    orderId: string,
    restaurantId: string,
    updateData: Partial<IPickupHandover>
  ): Promise<PickupHandoverDocument | null> {
    return PickupHandoverModel.findOneAndUpdate({ orderId, restaurantId }, updateData, { new: true });
  }
}

export const pickupRepository = new PickupRepository();
