import { Order } from '../orders/orders.model.js';
import { dispatchRepository } from './dispatch.repository.js';
import { eligibilityService } from './eligibility/eligibility.service.js';
import { rankingService } from './ranking/ranking.service.js';
import { offerService } from './offers/offer.service.js';
import { generateDispatchJobId, generateAttemptId } from './dispatch.utils.js';
import { logger } from '../../shared/utils/logger.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export class DispatchService {
  async executeDispatch(orderId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order ${orderId} not found for dispatch`);
    }

    const config = await dispatchRepository.getDispatchConfig();

    let job = await dispatchRepository.findJobByOrderId(orderId);
    if (!job) {
      job = await dispatchRepository.createDispatchJob({
        jobId: generateDispatchJobId(),
        orderId,
        restaurantId: order.restaurantId.toString(),
        status: 'PENDING',
        attemptsCount: 0,
        maxAttempts: config.maxAssignmentAttempts || 3,
        excludedRiderIds: [],
      });
    }

    // Determine location for eligibility
    const restaurantLocation = {
      latitude: (order as any).restaurantLocation?.coordinates?.[1] || 0,
      longitude: (order as any).restaurantLocation?.coordinates?.[0] || 0,
    };

    const eligibleRiders = await eligibilityService.findEligibleRiders(restaurantLocation, {
      maxRadiusKm: config.maxDispatchRadiusKm || 10,
      maxActiveDeliveries: config.maxActiveDeliveriesPerRider || 2,
      freshnessThresholdSeconds: config.locationFreshnessThresholdSeconds || 300,
      excludedRiderIds: job.excludedRiderIds || [],
    });

    if (eligibleRiders.length === 0) {
      logger.info(`[Dispatch] No eligible riders found for order ${orderId}`);
      await dispatchRepository.updateJobStatus(job.jobId, 'EXHAUSTED', {
        failureReason: 'NO_ELIGIBLE_RIDERS',
      });
      return { status: 'EXHAUSTED', message: 'No eligible riders available' };
    }

    const rankedRiders = rankingService.rankRiders(eligibleRiders, 'NORMAL');
    const topCandidate = rankedRiders[0];

    const attemptId = generateAttemptId();
    await dispatchRepository.recordAttempt({
      attemptId,
      jobId: job.jobId,
      orderId,
            selectedRiderId: topCandidate.riderId,
      candidatesCount: eligibleRiders.length,
      outcome: 'OFFER_CREATED',
    });

    const offer = await offerService.createOffer({
      orderId,
      riderId: topCandidate.riderId,
      restaurantId: order.restaurantId.toString(),
      score: topCandidate.score,
      distanceToRestaurantKm: topCandidate.distanceKm,
      offerTimeoutSeconds: config.offerTimeoutSeconds || 45,
    });

    await dispatchRepository.updateJobStatus(job.jobId, 'OFFER_DISPATCHED', {
      $inc: { attemptsCount: 1 },
      $addToSet: { excludedRiderIds: topCandidate.riderId },
    });

    return { status: 'OFFER_DISPATCHED', offerId: offer.offerId, riderId: topCandidate.riderId };
  }

  async cancelDispatch(orderId: string, reason?: string): Promise<any> {
    const job = await dispatchRepository.findJobByOrderId(orderId);
    if (!job) return null;

    return dispatchRepository.updateJobStatus(job.jobId, 'CANCELLED', {
      cancelledAt: new Date(),
      cancellationReason: reason || 'MANUAL_CANCELLATION',
    });
  }

  async handleRiderRejectionOrExpiry(orderId: string, riderId: string): Promise<any> {
    const job = await dispatchRepository.findJobByOrderId(orderId);
    if (!job) return null;

    if (job.attemptsCount < job.maxAttempts) {
      await job.save();
      return this.executeDispatch(orderId);
    } else {
      return dispatchRepository.updateJobStatus(job.jobId, 'EXHAUSTED', {
        failureReason: 'MAX_ATTEMPTS_REACHED',
      });
    }
  }
}

export const dispatchService = new DispatchService();
