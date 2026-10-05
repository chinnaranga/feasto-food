import mongoose, { Schema, Document } from 'mongoose';
import { IPickupHandover } from './pickup.types.js';
import { HANDOVER_STATUSES } from './pickup.constants.js';

export interface PickupHandoverDocument extends Omit<IPickupHandover, '_id'>, Document {}

const PickupHandoverSchema = new Schema<PickupHandoverDocument>(
  {
    handoverId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
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
    status: {
      type: String,
      enum: HANDOVER_STATUSES,
      default: 'WAITING_FOR_RIDER',
      index: true,
    },
    verificationCode: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    riderArrivedAt: {
      type: Date,
    },
    handoffStartedAt: {
      type: Date,
    },
    handoffCompletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

PickupHandoverSchema.index({ restaurantId: 1, status: 1 });

export const PickupHandoverModel = mongoose.model<PickupHandoverDocument>(
  'PickupHandover',
  PickupHandoverSchema
);
