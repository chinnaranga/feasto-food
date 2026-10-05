import { Queue } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

const hasRedis = !!(
  process.env.REDIS_HOST ||
  (process.env.REDIS_URL &&
    !process.env.REDIS_URL.includes('127.0.0.1') &&
    !process.env.REDIS_URL.includes('localhost'))
);

let notificationsQueue: Queue | null = null;
let pushQueue: Queue | null = null;
let emailQueue: Queue | null = null;
let smsQueue: Queue | null = null;
let retryQueue: Queue | null = null;

if (hasRedis) {
  try {
    notificationsQueue = new Queue('notifications', { connection: connectionOptions });
    pushQueue = new Queue('pushNotifications', { connection: connectionOptions });
    emailQueue = new Queue('emailNotifications', { connection: connectionOptions });
    smsQueue = new Queue('smsNotifications', { connection: connectionOptions });
    retryQueue = new Queue('notificationRetries', { connection: connectionOptions });
  } catch (err: any) {
    logger.warn(`[BullMQ Queues] Redis connection bypass: ${err.message}`);
  }
}

export { notificationsQueue, pushQueue, emailQueue, smsQueue, retryQueue };

export async function addNotificationJob(name: string, data: Record<string, any>, opts?: Record<string, any>) {
  if (!notificationsQueue) {
    logger.info(`[Queue Bypass] Simulated job addition: ${name}`);
    return;
  }
  return notificationsQueue.add(name, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    ...opts,
  });
}
