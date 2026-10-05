import { notificationsRepository } from './notifications.repository.js';
import {
  generateNotificationId,
  generateDeviceId,
  generateEventId,
  generateDeliveryId,
} from './notifications.utils.js';
import {
  INotification,
  INotificationPreferences,
  INotificationDevice,
} from './notifications.types.js';
import { getResolvedTemplate } from './templates/template.resolver.js';
import { addNotificationJob } from './jobs/notification.queue.js';
import { sendInAppNotification } from './channels/inApp.channel.js';
import { sendRealtimeChannelNotification } from './channels/realtime.channel.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export class NotificationsService {
  // 1. EVENT DISPATCH & NOTIFICATION GENERATION
  async dispatchNotificationEvent(eventData: {
    eventId?: string;
    type: string;
    recipientUserId: string;
    recipientEmail?: string;
    recipientPhone?: string;
    entityType?: string;
    entityId?: string;
    payload?: Record<string, any>;
    priority?: any;
  }): Promise<{ dispatched: boolean; notificationIds: string[] }> {
    const eventId = eventData.eventId || generateEventId();

    // Idempotency check
    const isDup = await notificationsRepository.isDuplicateEvent(eventId);
    if (isDup) {
      return { dispatched: false, notificationIds: [] };
    }

    await notificationsRepository.createNotificationEvent({
      eventId,
      type: eventData.type as any,
      recipientUserId: eventData.recipientUserId,
      entityType: eventData.entityType,
      entityId: eventData.entityId,
      payload: eventData.payload || {},
      priority: eventData.priority || 'NORMAL',
      processed: true,
    });

    const userPrefs = await this.getOrCreateUserPreferences(eventData.recipientUserId);
    const category = this.resolveCategory(eventData.type);
    const resolvedTpl = getResolvedTemplate(eventData.type, eventData.payload || {});

    const enabledChannels = this.resolveEnabledChannels(category, userPrefs, eventData.type);

    const notificationIds: string[] = [];

    for (const channel of enabledChannels) {
      const notificationId = generateNotificationId();

      const notif = await notificationsRepository.createNotification({
        notificationId,
        recipientUserId: eventData.recipientUserId,
        type: eventData.type as any,
        category,
        title: resolvedTpl.title,
        body: resolvedTpl.body,
        data: eventData.payload,
        channel,
        priority: eventData.priority || 'NORMAL',
        status: 'QUEUED',
        isArchived: false,
        retryCount: 0,
        entityType: eventData.entityType,
        entityId: eventData.entityId,
      });

      notificationIds.push(notificationId);

      // Record delivery attempt
      await notificationsRepository.createDeliveryRecord({
        deliveryId: generateDeliveryId(),
        notificationId,
        channel,
        status: 'QUEUED',
        provider: channel.toLowerCase(),
        attempt: 1,
      });

      // Deliver synchronous fast channels
      if (channel === 'IN_APP') {
        await sendInAppNotification(notif);
      } else if (channel === 'REALTIME') {
        await sendRealtimeChannelNotification(notif);
      } else {
        // Enqueue async push/email/sms jobs
        await addNotificationJob(`send_${channel.toLowerCase()}`, {
          notification: notif,
          recipientEmail: eventData.recipientEmail,
          recipientPhone: eventData.recipientPhone,
          emailSubject: resolvedTpl.emailSubject,
          emailHtml: resolvedTpl.emailHtml,
          smsText: resolvedTpl.smsText,
        });
      }
    }

    return { dispatched: true, notificationIds };
  }

  private resolveCategory(type: string): any {
    if (type.startsWith('ORDER_')) return 'order';
    if (type.startsWith('RIDER_') || type.startsWith('DELIVERY_')) return 'delivery';
    if (type.startsWith('PAYMENT_') || type.startsWith('PAYOUT_') || type.startsWith('REFUND_')) return 'payment';
    if (type.includes('SECURITY') || type.includes('LOGIN') || type.includes('PASSWORD')) return 'security';
    if (type.startsWith('RESTAURANT_')) return 'restaurant';
    return 'account';
  }

  private resolveEnabledChannels(category: string, prefs: INotificationPreferences, type: string): Array<any> {
    const defaultChannels = ['IN_APP', 'REALTIME'];

    // Critical security and essential transactional order alerts bypass marketing restrictions
    const isEssential = ['SECURITY_ALERT', 'PASSWORD_RESET', 'ORDER_PLACED', 'ORDER_DELIVERED'].includes(type);

    let prefGroup: any;
    if (category === 'order') prefGroup = prefs.channelPreferences.orderUpdates;
    else if (category === 'delivery') prefGroup = prefs.channelPreferences.deliveryUpdates;
    else if (category === 'payment') prefGroup = prefs.channelPreferences.paymentUpdates;
    else if (category === 'security') prefGroup = prefs.channelPreferences.securityAlerts;
    else prefGroup = prefs.channelPreferences.accountAlerts;

    if (isEssential || prefGroup?.push) defaultChannels.push('PUSH');
    if (isEssential || prefGroup?.email) defaultChannels.push('EMAIL');
    if (isEssential || prefGroup?.sms) defaultChannels.push('SMS');

    return defaultChannels;
  }

  // 2. IN-APP NOTIFICATIONS MANAGEMENT
  async getUserNotifications(recipientUserId: string, query: Record<string, any> = {}, limit = 50, skip = 0): Promise<INotification[]> {
    return notificationsRepository.findUserNotifications(recipientUserId, query, limit, skip);
  }

  async getUnreadUserNotifications(recipientUserId: string): Promise<{ count: number; items: INotification[] }> {
    const items = await notificationsRepository.findUserNotifications(recipientUserId, { readAt: null }, 50, 0);
    const count = await notificationsRepository.countUnreadUserNotifications(recipientUserId);
    return { count, items };
  }

  async getNotificationById(notificationId: string, recipientUserId: string): Promise<INotification> {
    const notif = await notificationsRepository.findNotificationById(notificationId);
    if (!notif || notif.recipientUserId !== recipientUserId) {
      throw new NotFoundError(`Notification ${notificationId} not found`);
    }
    return notif;
  }

  async markAsRead(notificationId: string, recipientUserId: string): Promise<INotification> {
    const notif = await notificationsRepository.markAsRead(notificationId, recipientUserId);
    if (!notif) throw new NotFoundError(`Notification ${notificationId} not found`);
    return notif;
  }

  async markAllAsRead(recipientUserId: string): Promise<{ modifiedCount: number }> {
    const modifiedCount = await notificationsRepository.markAllAsRead(recipientUserId);
    return { modifiedCount };
  }

  async archiveNotification(notificationId: string, recipientUserId: string): Promise<INotification> {
    const notif = await notificationsRepository.archiveNotification(notificationId, recipientUserId);
    if (!notif) throw new NotFoundError(`Notification ${notificationId} not found`);
    return notif;
  }

  async deleteNotification(notificationId: string, recipientUserId: string): Promise<boolean> {
    return notificationsRepository.deleteNotification(notificationId, recipientUserId);
  }

  // 3. PREFERENCES
  async getOrCreateUserPreferences(userId: string): Promise<INotificationPreferences> {
    let prefs = await notificationsRepository.findPreferencesByUserId(userId);
    if (!prefs) {
      prefs = await notificationsRepository.upsertPreferences(userId, {
        userId,
        channelPreferences: {
          orderUpdates: { push: true, email: true, sms: true, inApp: true },
          deliveryUpdates: { push: true, email: true, sms: true, inApp: true },
          paymentUpdates: { push: true, email: true, sms: true, inApp: true },
          securityAlerts: { push: true, email: true, sms: true, inApp: true },
          accountAlerts: { push: true, email: true, sms: false, inApp: true },
          restaurantAlerts: { push: true, email: true, sms: false, inApp: true },
          riderAlerts: { push: true, email: true, sms: false, inApp: true },
          promotionalMessages: { push: false, email: false, sms: false, inApp: false },
        },
      });
    }
    return prefs;
  }

  async updateUserPreferences(userId: string, updateData: Partial<INotificationPreferences>): Promise<INotificationPreferences> {
    return notificationsRepository.upsertPreferences(userId, updateData);
  }

  // 4. DEVICE MANAGEMENT
  async registerDevice(userId: string, token: string, platform: any = 'web', appVersion?: string): Promise<INotificationDevice> {
    const deviceId = generateDeviceId();
    return notificationsRepository.registerDevice({
      deviceId,
      userId,
      token,
      platform,
      appVersion,
    });
  }

  async getUserDevices(userId: string): Promise<INotificationDevice[]> {
    return notificationsRepository.findUserDevices(userId);
  }

  async updateDevice(deviceId: string, userId: string, updateData: Partial<INotificationDevice>): Promise<INotificationDevice> {
    const dev = await notificationsRepository.updateDevice(deviceId, userId, updateData);
    if (!dev) throw new NotFoundError(`Device ${deviceId} not found`);
    return dev;
  }

  async removeDevice(deviceId: string, userId: string): Promise<boolean> {
    return notificationsRepository.removeDevice(deviceId, userId);
  }
}

export const notificationsService = new NotificationsService();
