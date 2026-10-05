import { MembershipTier } from '@/types/loyalty';
import { REWARDS_CONSTANTS } from '@/constants/loyalty';

export const rewardsClient = {
  calculateEarnedPoints(orderAmount: number, tier: MembershipTier): number {
    let multiplier = 1.0;
    if (tier === 'plus') multiplier = 1.5;
    if (tier === 'elite') multiplier = 2.0;

    const basePoints = orderAmount * REWARDS_CONSTANTS.POINTS_PER_INR_SPENT;
    return Math.round(basePoints * multiplier);
  },

  pointsToCredits(points: number): number {
    return Math.floor(points * REWARDS_CONSTANTS.POINTS_CONVERSION_RATE);
  },

  creditsToPoints(credits: number): number {
    return Math.round(credits / REWARDS_CONSTANTS.POINTS_CONVERSION_RATE);
  },

  calculatePointsNeededForReward(currentPoints: number, milestonePoints = 500): number {
    if (currentPoints >= milestonePoints) return 0;
    return milestonePoints - currentPoints;
  },

  calculateProgressPercentage(currentPoints: number, milestonePoints = 500): number {
    if (currentPoints >= milestonePoints) return 100;
    return Math.min(100, Math.round((currentPoints / milestonePoints) * 100));
  },
};
