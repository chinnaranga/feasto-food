import { Schema, model, Document, Types } from 'mongoose';

export type TrackingSessionStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export interface ILocationSnapshot {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp: Date;
}

export interface IDeliveryTrackingSessionDocument extends Document {
  sessionId: string;
  orderId: Types.ObjectId;
  riderId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: TrackingSessionStatus;
  currentLocation?: ILocationSnapshot;
  etaMinutes: number;
  distanceRemainingKm: number;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const locationSnapshotSchema = new Schema<ILocationSnapshot>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    heading: { type: Number, min: 0, max: 360 },
    speed: { type: Number, min: 0 },
    accuracy: { type: Number, min: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const deliveryTrackingSessionSchema = new Schema<IDeliveryTrackingSessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
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
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    currentLocation: {
      type: locationSnapshotSchema,
    },
    etaMinutes: { type: Number, default: 15 },
    distanceRemainingKm: { type: Number, default: 3.5 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

deliveryTrackingSessionSchema.index({ orderId: 1, status: 1 });

export const DeliveryTrackingSession = model<IDeliveryTrackingSessionDocument>(
  'DeliveryTrackingSession',
  deliveryTrackingSessionSchema
);
