import { NotificationModel } from '../models/notification.model.js';
import { INotification } from '../notifications.types.js';

export async function sendInAppNotification(notification: INotification): Promise<string> {
  const doc = await NotificationModel.findOneAndUpdate(
    { notificationId: notification.notificationId },
    { status: 'DELIVERED', deliveredAt: new Date() },
    { new: true }
  );
  return doc?.notificationId || notification.notificationId;
}
