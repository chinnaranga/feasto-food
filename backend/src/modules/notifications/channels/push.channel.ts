import { pushProvider } from '../providers/push.provider.js';
import { NotificationDeviceModel } from '../models/notificationDevice.model.js';
import { INotification } from '../notifications.types.js';

export async function sendPushChannelNotification(notification: INotification): Promise<string> {
  const devices = await NotificationDeviceModel.find({
    userId: notification.recipientUserId,
    isActive: true,
  });

  if (devices.length === 0) {
    return 'no_active_push_devices';
  }

  const tokens = devices.map((d) => d.token);
  const successCount = await pushProvider.sendBatch(
    tokens,
    notification.title,
    notification.body,
    notification.data
  );

  return `push_sent_${successCount}_devices`;
}
