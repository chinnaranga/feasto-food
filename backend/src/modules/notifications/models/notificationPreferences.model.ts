import mongoose, { Schema, Document } from 'mongoose';
import { INotificationPreferences } from '../notifications.types.js';

export interface NotificationPreferencesDocument extends Omit<INotificationPreferences, '_id'>, Document {}

const ChannelPrefSchema = new Schema(
  {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true },
  },
  { _id: false }
);

const NotificationPreferencesSchema = new Schema<NotificationPreferencesDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    channelPreferences: {
      orderUpdates: { type: ChannelPrefSchema, default: { push: true, email: true, sms: true, inApp: true } },
      deliveryUpdates: { type: ChannelPrefSchema, default: { push: true, email: true, sms: true, inApp: true } },
      paymentUpdates: { type: ChannelPrefSchema, default: { push: true, email: true, sms: true, inApp: true } },
      securityAlerts: { type: ChannelPrefSchema, default: { push: true, email: true, sms: true, inApp: true } },
      accountAlerts: { type: ChannelPrefSchema, default: { push: true, email: true, sms: false, inApp: true } },
      restaurantAlerts: { type: ChannelPrefSchema, default: { push: true, email: true, sms: false, inApp: true } },
      riderAlerts: { type: ChannelPrefSchema, default: { push: true, email: true, sms: false, inApp: true } },
      promotionalMessages: { type: ChannelPrefSchema, default: { push: false, email: false, sms: false, inApp: false } },
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationPreferencesModel = mongoose.model<NotificationPreferencesDocument>(
  'NotificationPreferences',
  NotificationPreferencesSchema
);
