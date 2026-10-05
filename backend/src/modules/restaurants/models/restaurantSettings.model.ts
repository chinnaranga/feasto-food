import { Schema, model, Document, Types } from 'mongoose';

export interface IRestaurantSettingsDocument extends Document {
  restaurantId: Types.ObjectId;
  orderSettings: {
    autoAcceptOrders: boolean;
    prepTimeMinutes: number;
    minOrderValue: number;
  };
  notificationSettings: {
    newOrderEmail: boolean;
    newOrderPush: boolean;
    newOrderSms: boolean;
  };
  serviceToggles: {
    allowDineIn: boolean;
    allowTakeaway: boolean;
    allowDelivery: boolean;
    allowPickup: boolean;
    pauseOrders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSettingsSchema = new Schema<IRestaurantSettingsDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      unique: true,
      index: true,
    },
    orderSettings: {
      autoAcceptOrders: { type: Boolean, default: false },
      prepTimeMinutes: { type: Number, default: 20, min: 5, max: 120 },
      minOrderValue: { type: Number, default: 0, min: 0 },
    },
    notificationSettings: {
      newOrderEmail: { type: Boolean, default: true },
      newOrderPush: { type: Boolean, default: true },
      newOrderSms: { type: Boolean, default: false },
    },
    serviceToggles: {
      allowDineIn: { type: Boolean, default: true },
      allowTakeaway: { type: Boolean, default: true },
      allowDelivery: { type: Boolean, default: true },
      allowPickup: { type: Boolean, default: true },
      pauseOrders: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export const RestaurantSettings = model<IRestaurantSettingsDocument>(
  'RestaurantSettings',
  restaurantSettingsSchema
);
