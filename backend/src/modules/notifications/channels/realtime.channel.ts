import { socketGateway } from '../../../config/socket.js';
import { INotification } from '../notifications.types.js';

export async function sendRealtimeChannelNotification(notification: INotification): Promise<string> {
  const room = `user:${notification.recipientUserId}`;
  socketGateway.emitToRoom('/notifications', room, 'notification:received', {
    notificationId: notification.notificationId,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    category: notification.category,
    data: notification.data,
    createdAt: notification.createdAt || new Date().toISOString(),
  });

  if (notification.entityType === 'order' && notification.entityId) {
    socketGateway.emitToRoom('/notifications', `order:${notification.entityId}`, 'order:notification', {
      type: notification.type,
      title: notification.title,
      body: notification.body,
    });
  }

  return `realtime_emitted_${room}`;
}
