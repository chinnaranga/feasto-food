import mongoose, { Schema, Document } from 'mongoose';
import { IVerificationReview } from '../admin.types.js';
import { VERIFICATION_STATUSES } from '../admin.constants.js';

export interface VerificationReviewDocument extends Omit<IVerificationReview, '_id'>, Document {}

const VerificationReviewSchema = new Schema<VerificationReviewDocument>(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['restaurant', 'rider', 'document', 'account'],
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: 'PENDING',
      index: true,
    },
    reviewerId: {
      type: String,
    },
    reason: {
      type: String,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

VerificationReviewSchema.index({ targetType: 1, targetId: 1 });

export const VerificationReviewModel = mongoose.model<VerificationReviewDocument>(
  'VerificationReview',
  VerificationReviewSchema
);
