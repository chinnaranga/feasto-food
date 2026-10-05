import { Schema, model, Document, Types } from 'mongoose';
import { IOrderPricingSnapshot } from '../orders.model.js';

export interface ICheckoutSessionDocument extends Document {
  sessionId: string;
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  cartSnapshot: Record<string, unknown>;
  pricingSummary: IOrderPricingSnapshot;
  deliveryAddressId?: Types.ObjectId;
  paymentMethod: string;
  isConfirmed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const checkoutSessionSchema = new Schema<ICheckoutSessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    cartSnapshot: {
      type: Schema.Types.Mixed,
      required: true,
    },
    pricingSummary: {
      subtotal: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      deliveryFee: { type: Number, required: true },
      packagingFee: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      tipAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    paymentMethod: {
      type: String,
      default: 'card',
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '30m' }, // TTL 30 minutes
    },
  },
  {
    timestamps: true,
  }
);

export const CheckoutSession = model<ICheckoutSessionDocument>(
  'CheckoutSession',
  checkoutSessionSchema
);
