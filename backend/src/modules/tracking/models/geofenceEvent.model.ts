import { Schema, model, Document, Types } from 'mongoose';

export type GeofenceType = 'restaurant' | 'customer' | 'branch';
export type GeofenceEventType = 'enter' | 'exit';

export interface IGeofenceEventDocument extends Document {
  sessionId: Types.ObjectId;
  orderId: Types.ObjectId;
  riderId: Types.ObjectId;
  geofenceType: GeofenceType;
  eventType: GeofenceEventType;
  createdAt: Date;
}

const geofenceEventSchema = new Schema<IGeofenceEventDocument>(
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
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
    },
    geofenceType: {
      type: String,
      enum: ['restaurant', 'customer', 'branch'],
      required: true,
    },
    eventType: {
      type: String,
      enum: ['enter', 'exit'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const GeofenceEvent = model<IGeofenceEventDocument>(
  'GeofenceEvent',
  geofenceEventSchema
);
