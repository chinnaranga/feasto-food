import mongoose, { Schema, Document } from 'mongoose';
import { IRefund } from '../payments.types.js';
import { REFUND_LIFECYCLE_STATUSES, DEFAULT_CURRENCY } from '../payments.constants.js';

export interface RefundDocument extends Omit<IRefund, '_id'>, Document {}

const RefundSchema = new Schema<RefundDocument>(
  {
    refundId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: DEFAULT_CURRENCY,
    },
    status: {
      type: String,
      enum: REFUND_LIFECYCLE_STATUSES,
      required: true,
      default: 'initiated',
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    gatewayRefundId: {
      type: String,
      index: true,
    },
    approvedBy: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

RefundSchema.index({ customerId: 1, createdAt: -1 });
RefundSchema.index({ paymentId: 1 });

export const RefundModel = mongoose.model<RefundDocument>('Refund', RefundSchema);
