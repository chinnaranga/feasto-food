import { Schema, model, Document, Types } from 'mongoose';

export type AssignmentStatus =
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'completed'
  | 'cancelled';

export type RiderDeliveryStatus =
  | 'assigned'
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'arrived_at_customer'
  | 'delivered';

export interface IRiderAssignmentDocument extends Document {
  riderId: Types.ObjectId;
  orderId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  assignmentStatus: AssignmentStatus;
  deliveryStatus: RiderDeliveryStatus;
  assignedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const riderAssignmentSchema = new Schema<IRiderAssignmentDocument>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
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
    assignmentStatus: {
      type: String,
      enum: ['offered', 'accepted', 'rejected', 'expired', 'completed', 'cancelled'],
      default: 'offered',
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: [
        'assigned',
        'arrived_at_restaurant',
        'picked_up',
        'arrived_at_customer',
        'delivered',
      ],
      default: 'assigned',
      index: true,
    },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

riderAssignmentSchema.index({ riderId: 1, assignmentStatus: 1 });

export const RiderAssignment = model<IRiderAssignmentDocument>(
  'RiderAssignment',
  riderAssignmentSchema
);
