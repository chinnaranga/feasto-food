import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';
import { membershipClient } from '@/services/loyalty/membershipClient';
import { MembershipTier } from '@/types/loyalty';

export function useMembershipPlan() {
  const tier = useLoyaltyStore((state) => state.membershipTier);
  const renewalDate = useLoyaltyStore((state) => state.renewalDate);
  const setTier = useLoyaltyStore((state) => state.setMembershipTier);

  const planDetails = membershipClient.getPlanDetails(tier);
  const perks = membershipClient.getPlanPerks(tier);

  return {
    tier,
    renewalDate,
    planDetails,
    perks,
    upgradePlan: (newTier: MembershipTier) => setTier(newTier),
    downgradePlan: (newTier: MembershipTier) => setTier(newTier),
  };
}
