import crypto from 'crypto';

export function generateNotificationId(): string {
  return `notif_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateDeviceId(): string {
  return `dev_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateEventId(): string {
  return `nevt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateDeliveryId(): string {
  return `deliv_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function getDeduplicationKey(eventId: string, userId: string, channel: string): string {
  return `notification:${eventId}:${userId}:${channel}`;
}
