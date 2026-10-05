import mongoose, { Schema, Document } from 'mongoose';
import { IFinancialActivity } from '../payments.types.js';

export interface FinancialActivityDocument extends Omit<IFinancialActivity, '_id'>, Document {}

const FinancialActivitySchema = new Schema<FinancialActivityDocument>(
  {
    activityId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    actorId: {
      type: String,
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['payment', 'transaction', 'wallet', 'payout', 'refund', 'settlement'],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

FinancialActivitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const FinancialActivityModel = mongoose.model<FinancialActivityDocument>(
  'FinancialActivity',
  FinancialActivitySchema
);
