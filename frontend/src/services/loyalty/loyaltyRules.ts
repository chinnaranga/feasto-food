import { MembershipTier } from '@/types/loyalty';

export const loyaltyRules = {
  isEligibleForVIPAccess(tier: MembershipTier): boolean {
    return tier === 'elite';
  },

  isEligibleForMemberOnlyOffer(tier: MembershipTier): boolean {
    return tier === 'plus' || tier === 'elite';
  },

  calculateStreakBonusPoints(streakDays: number): number {
    if (streakDays < 3) return 0;
    if (streakDays === 3) return 50;
    if (streakDays === 5) return 100;
    if (streakDays >= 7) return 200;
    return 0;
  },

  calculateExpiryDate(days = 90): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  },
};
