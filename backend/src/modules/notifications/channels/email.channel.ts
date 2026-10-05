import { emailProvider } from '../providers/email.provider.js';
import { INotification } from '../notifications.types.js';

export async function sendEmailChannelNotification(
  notification: INotification,
  recipientEmail: string,
  subject?: string,
  html?: string
): Promise<string> {
  const emailSubj = subject || notification.title;
  const emailBody = html || `<p>${notification.body}</p>`;

  return emailProvider.sendEmail(recipientEmail, emailSubj, emailBody, notification.body);
}
