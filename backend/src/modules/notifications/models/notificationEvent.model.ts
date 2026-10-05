import mongoose, { Schema, Document } from 'mongoose';
import { INotificationEvent } from '../notifications.types.js';
import { NOTIFICATION_PRIORITIES } from '../notifications.constants.js';

export interface NotificationEventDocument extends Omit<INotificationEvent, '_id'>, Document {}

const NotificationEventSchema = new Schema<NotificationEventDocument>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    recipientUserId: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
    },
    entityId: {
      type: String,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: 'NORMAL',
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationEventSchema.index({ recipientUserId: 1, processed: 1 });

export const NotificationEventModel = mongoose.model<NotificationEventDocument>(
  'NotificationEvent',
  NotificationEventSchema
);
