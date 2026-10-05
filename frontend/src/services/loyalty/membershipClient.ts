import { MembershipTier } from '@/types/loyalty';
import { MEMBERSHIP_PRICING, TIER_PERKS } from '@/constants/loyalty';

export const membershipClient = {
  getPlanDetails(tier: MembershipTier) {
    return MEMBERSHIP_PRICING[tier];
  },

  getPlanPerks(tier: MembershipTier): string[] {
    return TIER_PERKS[tier];
  },

  calculateRenewalDate(months = 1): string {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  },

  isEligibleForFreeDelivery(tier: MembershipTier, orderAmount: number): boolean {
    if (tier === 'elite') return true;
    if (tier === 'plus' && orderAmount >= 199) return true;
    return false;
  },
};
