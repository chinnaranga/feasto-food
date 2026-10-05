import mongoose, { Schema, Document } from 'mongoose';
import { IGatewayEvent } from '../payments.types.js';

export interface GatewayEventDocument extends Omit<IGatewayEvent, '_id'>, Document {}

const GatewayEventSchema = new Schema<GatewayEventDocument>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    gateway: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    signature: {
      type: String,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

GatewayEventSchema.index({ gateway: 1, eventType: 1, processed: 1 });

export const GatewayEventModel = mongoose.model<GatewayEventDocument>('GatewayEvent', GatewayEventSchema);
