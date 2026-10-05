import { Worker, Job } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';
import { dispatchService } from '../dispatch.service.js';

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

let dispatchRetryWorker: Worker | null = null;

try {
  dispatchRetryWorker = new Worker(
    'dispatchRetryQueue',
    async (job: Job) => {
      logger.info(`[DispatchRetryWorker] Retrying dispatch for order ${job.data.orderId}`);
      await dispatchService.executeDispatch(job.data.orderId);
    },
    { connection: connectionOptions }
  );
} catch (err: any) {
  logger.warn(`[DispatchRetryWorker] Disabled in environment: ${err.message}`);
}

export { dispatchRetryWorker };
