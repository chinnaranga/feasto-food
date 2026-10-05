import { Worker, Job } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';
import { dispatchService } from '../dispatch.service.js';

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

let dispatchWorker: Worker | null = null;

try {
  dispatchWorker = new Worker(
    'dispatchQueue',
    async (job: Job) => {
      logger.info(`[DispatchWorker] Processing job ${job.id} for order ${job.data.orderId}`);
      await dispatchService.executeDispatch(job.data.orderId);
    },
    { connection: connectionOptions, concurrency: 5 }
  );

  dispatchWorker.on('failed', (job, err) => {
    logger.error(`[DispatchWorker] Job ${job?.id} failed: ${err.message}`);
  });
} catch (err: any) {
  logger.warn(`[DispatchWorker] Disabled in environment: ${err.message}`);
}

export { dispatchWorker };
