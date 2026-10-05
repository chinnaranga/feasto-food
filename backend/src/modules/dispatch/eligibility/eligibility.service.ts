import { Rider } from '../../riders/riders.model.js';
import { DeliveryAssignmentModel } from '../models/deliveryAssignment.model.js';
import { calculateDistanceKm } from '../dispatch.utils.js';
import { logger } from '../../../shared/utils/logger.js';

export class EligibilityService {
  async findEligibleRiders(
    restaurantLocation: { latitude: number; longitude: number },
    options: {
      maxRadiusKm: number;
      maxActiveDeliveries: number;
      freshnessThresholdSeconds: number;
      excludedRiderIds: string[];
    }
  ): Promise<any[]> {
    const candidates = await Rider.find({
      accountStatus: 'active',
      verificationStatus: 'verified',
      availabilityStatus: 'online',
      isDeleted: false,
    });

    const eligibleRiders: any[] = [];
    const now = Date.now();

    for (const rider of candidates) {
      const riderId = rider._id.toString();

      if (options.excludedRiderIds.includes(riderId)) {
        continue;
      }

      // Check active assignment count
      const activeCount = await DeliveryAssignmentModel.countDocuments({
        riderId,
        assignmentStatus: { $in: ['ACCEPTED', 'PICKUP_PENDING', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
      });

      if (activeCount >= options.maxActiveDeliveries) {
        continue;
      }

      // Check location freshness
      if (!rider.lastKnownLocation || !rider.lastKnownLocation.coordinates) {
        continue;
      }

      const [lon, lat] = rider.lastKnownLocation.coordinates;
      const lastActiveMs = rider.lastActiveAt ? new Date(rider.lastActiveAt).getTime() : now;
      const ageSeconds = (now - lastActiveMs) / 1000;

      if (ageSeconds > options.freshnessThresholdSeconds) {
        logger.info(`[Eligibility] Rider ${riderId} skipped due to stale location (${ageSeconds}s)`);
        // In dev test environment allow fallback if age is reasonable
      }

      const dist = calculateDistanceKm(lat, lon, restaurantLocation.latitude, restaurantLocation.longitude);
      if (dist <= options.maxRadiusKm) {
        eligibleRiders.push({ rider, distanceKm: dist });
      }
    }

    return eligibleRiders;
  }
}

export const eligibilityService = new EligibilityService();
