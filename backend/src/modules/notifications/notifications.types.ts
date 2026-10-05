import {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationCategory,
  NotificationEventType,
  DevicePlatform,
} from './notifications.constants.js';

export interface INotification {
  _id?: string;
  notificationId: string;
  recipientUserId: string;
  actorUserId?: string;
  type: NotificationEventType;
  category: NotificationCategory;
  title: string;
  body: string;
  data?: Record<string, any>;
  channel: NotificationChannel;
  priority: NotificationPriority;
  status: NotificationStatus;
  readAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  expiresAt?: Date;
  isArchived: boolean;
  retryCount: number;
  templateId?: string;
  templateVersion?: string;
  entityType?: string;
  entityId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChannelPreference {
  push: boolean;
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface INotificationPreferences {
  _id?: string;
  userId: string;
  channelPreferences: {
    orderUpdates: IChannelPreference;
    deliveryUpdates: IChannelPreference;
    paymentUpdates: IChannelPreference;
    securityAlerts: IChannelPreference;
    accountAlerts: IChannelPreference;
    restaurantAlerts: IChannelPreference;
    riderAlerts: IChannelPreference;
    promotionalMessages: IChannelPreference;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDevice {
  _id?: string;
  deviceId: string;
  userId: string;
  token: string;
  platform: DevicePlatform;
  isActive: boolean;
  appVersion?: string;
  lastSeenAt?: Date;
  tokenUpdatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationTemplate {
  _id?: string;
  templateId: string;
  type: NotificationEventType;
  version: string;
  locale: string;
  titleTemplate: string;
  bodyTemplate: string;
  emailSubjectTemplate?: string;
  emailHtmlTemplate?: string;
  smsTextTemplate?: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDelivery {
  _id?: string;
  deliveryId: string;
  notificationId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  provider: string;
  providerResponseId?: string;
  errorDetails?: string;
  attempt: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationEvent {
  _id?: string;
  eventId: string;
  type: NotificationEventType;
  recipientUserId: string;
  entityType?: string;
  entityId?: string;
  payload: Record<string, any>;
  priority: NotificationPriority;
  processed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
