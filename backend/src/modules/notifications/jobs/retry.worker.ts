import { Worker, Job } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';
import { NotificationModel } from '../models/notification.model.js';

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

let retryWorker: Worker | null = null;

try {
  retryWorker = new Worker(
    'notificationRetries',
    async (job: Job) => {
      const { notificationId } = job.data;
      logger.info(`[RetryWorker] Retrying notification ${notificationId}`);

      const notif = await NotificationModel.findOne({ notificationId });
      if (notif && notif.retryCount < 3) {
        await NotificationModel.updateOne(
          { notificationId },
          { $inc: { retryCount: 1 }, status: 'QUEUED' }
        );
      } else if (notif) {
        await NotificationModel.updateOne({ notificationId }, { status: 'FAILED', failedAt: new Date() });
      }
    },
    { connection: connectionOptions }
  );
} catch (err: any) {
  logger.warn(`[RetryWorker] Disabled in environment: ${err.message}`);
}

export { retryWorker };
