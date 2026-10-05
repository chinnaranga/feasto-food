import { smsProvider } from '../providers/sms.provider.js';
import { INotification } from '../notifications.types.js';

export async function sendSMSChannelNotification(
  notification: INotification,
  phoneNumber: string,
  smsText?: string
): Promise<string> {
  const text = smsText || `${notification.title}: ${notification.body}`;
  return smsProvider.sendSMS(phoneNumber, text);
}
