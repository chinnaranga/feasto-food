import { Schema, model, Document, Types } from 'mongoose';

export interface IRiderLocationHistoryDocument extends Document {
  sessionId: Types.ObjectId;
  riderId: Types.ObjectId;
  orderId: Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp: Date;
}

const riderLocationHistorySchema = new Schema<IRiderLocationHistoryDocument>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryTrackingSession',
      required: true,
      index: true,
    },
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
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    heading: { type: Number },
    speed: { type: Number },
    accuracy: { type: Number },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

riderLocationHistorySchema.index({ location: '2dsphere' });
riderLocationHistorySchema.index({ sessionId: 1, timestamp: -1 });

export const RiderLocationHistory = model<IRiderLocationHistoryDocument>(
  'RiderLocationHistory',
  riderLocationHistorySchema
);
