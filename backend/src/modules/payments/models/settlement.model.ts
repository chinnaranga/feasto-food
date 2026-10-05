import mongoose, { Schema, Document } from 'mongoose';
import { ISettlement } from '../payments.types.js';
import { SETTLEMENT_STATUSES } from '../payments.constants.js';

export interface SettlementDocument extends ISettlement, Document {}

const SettlementSchema = new Schema<SettlementDocument>(
  {
    settlementId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: String,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    grossAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    feeBreakdown: {
      gatewayFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
    },
    taxBreakdown: {
      gstAmount: { type: Number, default: 0 },
      tdsAmount: { type: Number, default: 0 },
    },
    netSettlementAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: SETTLEMENT_STATUSES,
      required: true,
      default: 'unsettled',
      index: true,
    },
    reconciled: {
      type: Boolean,
      default: false,
    },
    settledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

SettlementSchema.index({ restaurantId: 1, status: 1 });

export const SettlementModel = mongoose.model<SettlementDocument>('Settlement', SettlementSchema);
