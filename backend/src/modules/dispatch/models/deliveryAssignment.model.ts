import mongoose, { Schema, Document } from 'mongoose';
import { IDeliveryAssignment } from '../dispatch.types.js';
import { ASSIGNMENT_STATUSES } from '../dispatch.constants.js';

export interface DeliveryAssignmentDocument extends Omit<IDeliveryAssignment, '_id'>, Document {}

const DeliveryAssignmentSchema = new Schema<DeliveryAssignmentDocument>(
  {
    assignmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: String,
      required: true,
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
    offerId: {
      type: String,
      required: true,
      index: true,
    },
    assignmentStatus: {
      type: String,
      enum: ASSIGNMENT_STATUSES,
      default: 'PENDING',
      index: true,
    },
    assignmentVersion: {
      type: Number,
      default: 1,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    pickupStartedAt: {
      type: Date,
    },
    pickupCompletedAt: {
      type: Date,
    },
    deliveryStartedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index to guarantee atomic single active assignment per order
DeliveryAssignmentSchema.index({ orderId: 1, assignmentStatus: 1 });

export const DeliveryAssignmentModel = mongoose.model<DeliveryAssignmentDocument>(
  'DeliveryAssignment',
  DeliveryAssignmentSchema
);
