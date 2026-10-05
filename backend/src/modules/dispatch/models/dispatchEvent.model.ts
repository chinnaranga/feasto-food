import mongoose, { Schema, Document } from 'mongoose';
import { IDispatchEvent } from '../dispatch.types.js';

export interface DispatchEventDocument extends Omit<IDispatchEvent, '_id'>, Document {}

const DispatchEventSchema = new Schema<DispatchEventDocument>(
  {
    eventId: {
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
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const DispatchEventModel = mongoose.model<DispatchEventDocument>(
  'DispatchEvent',
  DispatchEventSchema
);
