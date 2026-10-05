import mongoose, { Schema, Document } from 'mongoose';
import { IDispatchAttempt } from '../dispatch.types.js';

export interface DispatchAttemptDocument extends Omit<IDispatchAttempt, '_id'>, Document {}

const DispatchAttemptSchema = new Schema<DispatchAttemptDocument>(
  {
    attemptId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    candidatesCount: {
      type: Number,
      default: 0,
    },
    selectedRiderId: {
      type: String,
      index: true,
    },
    offerId: {
      type: String,
      index: true,
    },
    outcome: {
      type: String,
      enum: ['OFFER_CREATED', 'NO_RIDER_ELIGIBLE', 'FAILED'],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const DispatchAttemptModel = mongoose.model<DispatchAttemptDocument>(
  'DispatchAttempt',
  DispatchAttemptSchema
);
