import mongoose, { Schema, Document } from 'mongoose';
import { IDispatchJob } from '../dispatch.types.js';
import { DISPATCH_PRIORITIES } from '../dispatch.constants.js';

export interface DispatchJobDocument extends Omit<IDispatchJob, '_id'>, Document {}

const DispatchJobSchema = new Schema<DispatchJobDocument>(
  {
    jobId: {
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
    branchId: {
      type: String,
      index: true,
    },
    priority: {
      type: String,
      enum: DISPATCH_PRIORITIES,
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['PENDING', 'DISPATCHING', 'ASSIGNED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    excludedRiderIds: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

DispatchJobSchema.index({ status: 1, createdAt: 1 });

export const DispatchJobModel = mongoose.model<DispatchJobDocument>('DispatchJob', DispatchJobSchema);
