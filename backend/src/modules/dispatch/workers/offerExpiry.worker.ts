import { Worker, Job } from 'bullmq';
import { logger } from '../../../shared/utils/logger.js';
import { DeliveryOfferModel } from '../models/deliveryOffer.model.js';
import { dispatchService } from '../dispatch.service.js';

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

let offerExpiryWorker: Worker | null = null;

if (hasRedis) {
  try {
    offerExpiryWorker = new Worker(
      'offerExpiryQueue',
      async (job: Job) => {
        const { offerId, orderId, riderId } = job.data;
        const offer = await DeliveryOfferModel.findOne({ offerId, status: 'PENDING' });

        if (offer && new Date() >= offer.expiresAt) {
          offer.status = 'EXPIRED';
          await offer.save();
          logger.info(`[OfferExpiryWorker] Offer ${offerId} expired. Retrying dispatch for order ${orderId}`);
          await dispatchService.handleRiderRejectionOrExpiry(orderId, riderId);
        }
      },
      { connection: connectionOptions }
    );
  } catch (err: any) {
    logger.warn(`[OfferExpiryWorker] Disabled in environment: ${err.message}`);
  }
}

export { offerExpiryWorker };
