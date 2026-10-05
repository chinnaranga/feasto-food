import mongoose, { Schema, Document } from 'mongoose';
import { IPayout } from '../payments.types.js';
import { PAYOUT_STATUSES, PAYOUT_METHODS, DEFAULT_CURRENCY } from '../payments.constants.js';

export interface PayoutDocument extends Omit<IPayout, '_id'>, Document {}

const PayoutSchema = new Schema<PayoutDocument>(
  {
    payoutId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    recipientType: {
      type: String,
      enum: ['restaurant', 'rider'],
      required: true,
      index: true,
    },
    walletId: {
      type: String,
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
      enum: PAYOUT_STATUSES,
      required: true,
      default: 'initiated',
      index: true,
    },
    payoutMethod: {
      type: String,
      enum: PAYOUT_METHODS,
      required: true,
      default: 'bank_transfer',
    },
    gatewayPayoutId: {
      type: String,
      index: true,
    },
    failureReason: {
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

PayoutSchema.index({ recipientId: 1, createdAt: -1 });

export const PayoutModel = mongoose.model<PayoutDocument>('Payout', PayoutSchema);
