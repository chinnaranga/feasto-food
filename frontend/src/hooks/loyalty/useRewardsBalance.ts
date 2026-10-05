import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';
import { rewardsClient } from '@/services/loyalty/rewardsClient';

export function useRewardsBalance() {
  const points = useLoyaltyStore((state) => state.pointsBalance);
  const credits = useLoyaltyStore((state) => state.redeemableCredits);
  const redeemPoints = useLoyaltyStore((state) => state.redeemPoints);
  const isModalOpen = useLoyaltyStore((state) => state.redemptionModalOpen);
  const setModalOpen = useLoyaltyStore((state) => state.setRedemptionModalOpen);

  const nextMilestone = 500;
  const pointsNeeded = rewardsClient.calculatePointsNeededForReward(points, nextMilestone);
  const progressPercent = rewardsClient.calculateProgressPercentage(points, nextMilestone);

  return {
    points,
    credits,
    pointsNeeded,
    progressPercent,
    isModalOpen,
    setModalOpen,
    redeem: (pts: number) => redeemPoints(pts),
  };
}
