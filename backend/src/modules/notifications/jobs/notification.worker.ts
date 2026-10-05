import { Worker, Job } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';
import { sendInAppNotification } from '../channels/inApp.channel.js';
import { sendPushChannelNotification } from '../channels/push.channel.js';
import { sendEmailChannelNotification } from '../channels/email.channel.js';
import { sendSMSChannelNotification } from '../channels/sms.channel.js';
import { sendRealtimeChannelNotification } from '../channels/realtime.channel.js';

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

let notificationWorker: Worker | null = null;

try {
  notificationWorker = new Worker(
    'notifications',
    async (job: Job) => {
      logger.info(`[NotificationWorker] Processing job ${job.id} - ${job.name}`);
      const { notification, recipientEmail, recipientPhone, emailSubject, emailHtml, smsText } = job.data;

      switch (notification.channel) {
        case 'IN_APP':
          await sendInAppNotification(notification);
          break;
        case 'PUSH':
          await sendPushChannelNotification(notification);
          break;
        case 'EMAIL':
          if (recipientEmail) {
            await sendEmailChannelNotification(notification, recipientEmail, emailSubject, emailHtml);
          }
          break;
        case 'SMS':
          if (recipientPhone) {
            await sendSMSChannelNotification(notification, recipientPhone, smsText);
          }
          break;
        case 'REALTIME':
          await sendRealtimeChannelNotification(notification);
          break;
      }
    },
    { connection: connectionOptions, concurrency: 5 }
  );

  notificationWorker.on('failed', (job, err) => {
    logger.error(`[NotificationWorker] Job ${job?.id} failed: ${err.message}`);
  });
} catch (err: any) {
  logger.warn(`[NotificationWorker] Disabled in environment: ${err.message}`);
}

export { notificationWorker };
