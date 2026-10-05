import { NotificationModel, NotificationDocument } from './models/notification.model.js';
import { NotificationPreferencesModel, NotificationPreferencesDocument } from './models/notificationPreferences.model.js';
import { NotificationDeviceModel, NotificationDeviceDocument } from './models/notificationDevice.model.js';
import { NotificationTemplateModel, NotificationTemplateDocument } from './models/notificationTemplate.model.js';
import { NotificationDeliveryModel, NotificationDeliveryDocument } from './models/notificationDelivery.model.js';
import { NotificationEventModel, NotificationEventDocument } from './models/notificationEvent.model.js';
import {
  INotification,
  INotificationPreferences,
  INotificationDevice,
  INotificationTemplate,
  INotificationDelivery,
  INotificationEvent,
} from './notifications.types.js';

export class NotificationsRepository {
  // NOTIFICATIONS
  async createNotification(data: Partial<INotification>): Promise<NotificationDocument> {
    return NotificationModel.create(data);
  }

  async findNotificationById(notificationId: string): Promise<NotificationDocument | null> {
    return NotificationModel.findOne({ notificationId });
  }

  async findUserNotifications(
    recipientUserId: string,
    query: Record<string, any> = {},
    limit = 50,
    skip = 0
  ): Promise<NotificationDocument[]> {
    return NotificationModel.find({ recipientUserId, isArchived: false, ...query })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  async countUnreadUserNotifications(recipientUserId: string): Promise<number> {
    return NotificationModel.countDocuments({ recipientUserId, readAt: null, isArchived: false });
  }

  async markAsRead(notificationId: string, recipientUserId: string): Promise<NotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      { notificationId, recipientUserId },
      { readAt: new Date(), status: 'READ' },
      { new: true }
    );
  }

  async markAllAsRead(recipientUserId: string): Promise<number> {
    const res = await NotificationModel.updateMany(
      { recipientUserId, readAt: null },
      { readAt: new Date(), status: 'READ' }
    );
    return res.modifiedCount;
  }

  async archiveNotification(notificationId: string, recipientUserId: string): Promise<NotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      { notificationId, recipientUserId },
      { isArchived: true },
      { new: true }
    );
  }

  async deleteNotification(notificationId: string, recipientUserId: string): Promise<boolean> {
    const res = await NotificationModel.deleteOne({ notificationId, recipientUserId });
    return res.deletedCount > 0;
  }

  // PREFERENCES
  async findPreferencesByUserId(userId: string): Promise<NotificationPreferencesDocument | null> {
    return NotificationPreferencesModel.findOne({ userId });
  }

  async upsertPreferences(
    userId: string,
    updateData: Partial<INotificationPreferences>
  ): Promise<NotificationPreferencesDocument> {
    return NotificationPreferencesModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
  }

  // DEVICES
  async registerDevice(data: Partial<INotificationDevice>): Promise<NotificationDeviceDocument> {
    return NotificationDeviceModel.findOneAndUpdate(
      { userId: data.userId, token: data.token },
      { $set: { ...data, isActive: true, lastSeenAt: new Date(), tokenUpdatedAt: new Date() } },
      { new: true, upsert: true }
    );
  }

  async findUserDevices(userId: string): Promise<NotificationDeviceDocument[]> {
    return NotificationDeviceModel.find({ userId, isActive: true });
  }

  async updateDevice(
    deviceId: string,
    userId: string,
    updateData: Partial<INotificationDevice>
  ): Promise<NotificationDeviceDocument | null> {
    return NotificationDeviceModel.findOneAndUpdate({ deviceId, userId }, updateData, { new: true });
  }

  async removeDevice(deviceId: string, userId: string): Promise<boolean> {
    const res = await NotificationDeviceModel.deleteOne({ deviceId, userId });
    return res.deletedCount > 0;
  }

  // TEMPLATES
  async findTemplate(type: string, locale = 'en-IN'): Promise<NotificationTemplateDocument | null> {
    return NotificationTemplateModel.findOne({ type, locale, enabled: true });
  }

  // DELIVERIES
  async createDeliveryRecord(data: Partial<INotificationDelivery>): Promise<NotificationDeliveryDocument> {
    return NotificationDeliveryModel.create(data);
  }

  // EVENTS
  async createNotificationEvent(data: Partial<INotificationEvent>): Promise<NotificationEventDocument> {
    return NotificationEventModel.create(data);
  }

  async isDuplicateEvent(eventId: string): Promise<boolean> {
    const existing = await NotificationEventModel.findOne({ eventId });
    return !!existing;
  }
}

export const notificationsRepository = new NotificationsRepository();
