import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';
import { MOCK_PERKS } from '@/constants/loyalty';
import { LoyaltyPerk } from '@/types/loyalty';

export function useMemberPerks() {
  const tier = useLoyaltyStore((state) => state.membershipTier);

  const activePerks: LoyaltyPerk[] = MOCK_PERKS.filter((perk) => {
    if (tier === 'elite') return true;
    if (tier === 'plus') {
      return perk.id === 'free_delivery' || perk.id === 'priority_support';
    }
    return false; // free tier gets no special premium perks
  });

  return {
    tier,
    activePerks,
  };
}
