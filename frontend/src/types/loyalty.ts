
export type MembershipTier = 'free' | 'plus' | 'elite';

export interface LoyaltyPerk {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface RewardTransaction {
  id: string;
  points: number;
  description: string;
  type: 'earn' | 'redeem';
  date: string;
  expiryDate?: string;
}

export interface Referral {
  id: string;
  friendName: string;
  friendEmail: string;
  status: 'pending' | 'completed';
  rewardEarned: number;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
}

export interface LoyaltySavings {
  deliveryFeesSaved: number;
  discountSavings: number;
  cashbackEarned: number;
}
