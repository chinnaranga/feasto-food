import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';

export function useRewardHistory() {
  const transactions = useLoyaltyStore((state) => state.transactions);

  return {
    transactions,
  };
}
