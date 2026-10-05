import { z } from 'zod';
import { NOTIFICATION_CHANNELS, NOTIFICATION_PRIORITIES, DEVICE_PLATFORMS } from './notifications.constants.js';

const channelPrefItem = z
  .object({
    push: z.boolean().optional(),
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    inApp: z.boolean().optional(),
  })
  .partial();

export const updatePreferencesSchema = z.object({
  channelPreferences: z
    .object({
      orderUpdates: channelPrefItem.optional(),
      deliveryUpdates: channelPrefItem.optional(),
      paymentUpdates: channelPrefItem.optional(),
      securityAlerts: channelPrefItem.optional(),
      accountAlerts: channelPrefItem.optional(),
      restaurantAlerts: channelPrefItem.optional(),
      riderAlerts: channelPrefItem.optional(),
      promotionalMessages: channelPrefItem.optional(),
    })
    .partial(),
});

export const registerDeviceSchema = z.object({
  token: z.string().min(1, 'Device push token is required'),
  platform: z.enum(DEVICE_PLATFORMS).default('web'),
  appVersion: z.string().optional(),
});

export const updateDeviceSchema = z.object({
  isActive: z.boolean().optional(),
  appVersion: z.string().optional(),
  token: z.string().optional(),
});

export const dispatchNotificationEventSchema = z.object({
  type: z.string().min(1, 'Notification event type is required'),
  recipientUserId: z.string().min(1, 'Recipient user ID is required'),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  payload: z.record(z.any()).default({}),
  priority: z.enum(NOTIFICATION_PRIORITIES).default('NORMAL'),
});
