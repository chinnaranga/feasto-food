import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';

export function useSavingsSummary() {
  const savings = useLoyaltyStore((state) => state.savings);

  const totalSaved = savings.deliveryFeesSaved + savings.discountSavings + savings.cashbackEarned;

  return {
    savings,
    totalSaved,
  };
}
