import { Schema, model, Document, Types } from 'mongoose';
import { IOrderItemSnapshot } from '../orders.model.js';

export interface ICartDocument extends Document {
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  items: IOrderItemSnapshot[];
  subtotal: number;
  estimatedTax: number;
  estimatedDeliveryFee: number;
  estimatedTotal: number;
  currency: string;
  updatedAt: Date;
}

const cartItemSchema = new Schema<IOrderItemSnapshot>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    itemName: { type: String, required: true },
    variantId: { type: String },
    variantName: { type: String },
    basePrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    addons: [
      {
        addonId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    itemTotal: { type: Number, required: true },
  },
  { _id: true }
);

const cartSchema = new Schema<ICartDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
      required: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    subtotal: { type: Number, default: 0 },
    estimatedTax: { type: Number, default: 0 },
    estimatedDeliveryFee: { type: Number, default: 3.99 },
    estimatedTotal: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICartDocument>('Cart', cartSchema);
