import mongoose, { Schema, Document } from 'mongoose';
import { INotificationDevice } from '../notifications.types.js';
import { DEVICE_PLATFORMS } from '../notifications.constants.js';

export interface NotificationDeviceDocument extends Omit<INotificationDevice, '_id'>, Document {}

const NotificationDeviceSchema = new Schema<NotificationDeviceDocument>(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: DEVICE_PLATFORMS,
      required: true,
      default: 'web',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    appVersion: {
      type: String,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    tokenUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

NotificationDeviceSchema.index({ userId: 1, isActive: 1 });

export const NotificationDeviceModel = mongoose.model<NotificationDeviceDocument>(
  'NotificationDevice',
  NotificationDeviceSchema
);
