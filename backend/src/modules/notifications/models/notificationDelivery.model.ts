import mongoose, { Schema, Document } from 'mongoose';
import { INotificationDelivery } from '../notifications.types.js';
import { NOTIFICATION_CHANNELS, NOTIFICATION_STATUSES } from '../notifications.constants.js';

export interface NotificationDeliveryDocument extends Omit<INotificationDelivery, '_id'>, Document {}

const NotificationDeliverySchema = new Schema<NotificationDeliveryDocument>(
  {
    deliveryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    notificationId: {
      type: String,
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      required: true,
    },
    status: {
      type: String,
      enum: NOTIFICATION_STATUSES,
      required: true,
      default: 'QUEUED',
    },
    provider: {
      type: String,
      required: true,
    },
    providerResponseId: {
      type: String,
    },
    errorDetails: {
      type: String,
    },
    attempt: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

NotificationDeliverySchema.index({ notificationId: 1, createdAt: -1 });

export const NotificationDeliveryModel = mongoose.model<NotificationDeliveryDocument>(
  'NotificationDelivery',
  NotificationDeliverySchema
);
