import { Schema, model, Document, Types } from 'mongoose';

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
}

export interface IDeliveryRouteSnapshotDocument extends Document {
  sessionId: Types.ObjectId;
  orderId: Types.ObjectId;
  waypoints: RouteWaypoint[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  createdAt: Date;
}

const deliveryRouteSnapshotSchema = new Schema<IDeliveryRouteSnapshotDocument>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryTrackingSession',
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    waypoints: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        _id: false,
      },
    ],
    totalDistanceKm: { type: Number, required: true },
    estimatedDurationMinutes: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DeliveryRouteSnapshot = model<IDeliveryRouteSnapshotDocument>(
  'DeliveryRouteSnapshot',
  deliveryRouteSnapshotSchema
);
