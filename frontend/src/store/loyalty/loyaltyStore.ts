import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MembershipTier, RewardTransaction, Referral, LoyaltySavings } from '@/types/loyalty';
import { rewardsClient } from '@/services/loyalty/rewardsClient';
import { referralClient } from '@/services/loyalty/referralClient';

interface LoyaltyState {
  membershipTier: MembershipTier;
  renewalDate: string | null;
  pointsBalance: number;
  redeemableCredits: number;
  transactions: RewardTransaction[];
  savings: LoyaltySavings;
  referrals: Referral[];
  referralCode: string;
  streakDays: number;
  lastOrderDate: string | null;
  unlockedAchievements: string[];
  redemptionModalOpen: boolean;

  // Actions
  setMembershipTier: (tier: MembershipTier) => void;
  updateRenewalDate: (date: string | null) => void;
  addPoints: (points: number, reason: string) => void;
  redeemPoints: (points: number) => { success: boolean; message: string };
  useCredits: (amount: number) => void;
  addReferral: (friendName: string, friendEmail: string) => void;
  completeReferral: (referralId: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockAchievement: (id: string) => void;
  updateSavings: (updater: Partial<LoyaltySavings>) => void;
  setRedemptionModalOpen: (open: boolean) => void;
  resetLoyaltyStore: () => void;
}

const DEFAULT_LOYALTY_STATE = {
  membershipTier: 'free' as MembershipTier,
  renewalDate: null as string | null,
  pointsBalance: 240,
  redeemableCredits: 24,
  transactions: [
    { id: 'tx-1', points: 150, description: 'Sign up welcome bonus points', type: 'earn' as const, date: '10 Jul 2026' },
    { id: 'tx-2', points: 90, description: 'Earned on order from Sora Sushi', type: 'earn' as const, date: '13 Jul 2026' },
  ],
  savings: {
    deliveryFeesSaved: 120,
    discountSavings: 150,
    cashbackEarned: 24,
  },
  referrals: [
    { id: 'ref-1', friendName: 'Ajay Kumar', friendEmail: 'ajay@feasto.ai', status: 'pending' as const, rewardEarned: 150, date: '12 Jul 2026' },
  ],
  referralCode: 'RAVI309',
  streakDays: 2,
  lastOrderDate: '2026-07-14',
  unlockedAchievements: ['first_bite'],
  redemptionModalOpen: false,
};

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_LOYALTY_STATE,

      setMembershipTier: (tier) =>
        set({
          membershipTier: tier,
          renewalDate: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        }),

      updateRenewalDate: (date) => set({ renewalDate: date }),

      addPoints: (points, reason) =>
        set((state) => {
          const newPoints = state.pointsBalance + points;
          const newCredits = rewardsClient.pointsToCredits(newPoints);
          const newTx: RewardTransaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            points,
            description: reason,
            type: 'earn',
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          };
          return {
            pointsBalance: newPoints,
            redeemableCredits: newCredits,
            transactions: [newTx, ...state.transactions],
          };
        }),

      redeemPoints: (points) => {
        const state = get();
        if (state.pointsBalance < points) {
          return { success: false, message: 'Insufficient points balance!' };
        }
        const creditsEarned = rewardsClient.pointsToCredits(points);
        const newTx: RewardTransaction = {
          id: `tx-${Math.random().toString(36).substr(2, 9)}`,
          points,
          description: 'Redeemed points to wallet credits',
          type: 'redeem',
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
        set((prev) => ({
          pointsBalance: prev.pointsBalance - points,
          redeemableCredits: prev.redeemableCredits + creditsEarned,
          transactions: [newTx, ...prev.transactions],
          savings: {
            ...prev.savings,
            cashbackEarned: prev.savings.cashbackEarned + creditsEarned,
          },
        }));
        return { success: true, message: `Successfully converted ${points} points to ₹${creditsEarned} credit!` };
      },

      useCredits: (amount) =>
        set((state) => {
          const pointsNeeded = rewardsClient.creditsToPoints(amount);
          const newTx: RewardTransaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            points: pointsNeeded,
            description: `Applied credit discount of ₹${amount} on checkout`,
            type: 'redeem',
            date: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          };
          return {
            pointsBalance: Math.max(0, state.pointsBalance - pointsNeeded),
            redeemableCredits: Math.max(0, state.redeemableCredits - amount),
            transactions: [newTx, ...state.transactions],
            savings: {
              ...state.savings,
              discountSavings: state.savings.discountSavings + amount,
            },
          };
        }),

      addReferral: (friendName, friendEmail) =>
        set((state) => {
          const newRef = referralClient.createNewReferral(friendName, friendEmail);
          return { referrals: [newRef, ...state.referrals] };
        }),

      completeReferral: (referralId) =>
        set((state) => {
          let rewardAmount = 0;
          const updatedReferrals = state.referrals.map((ref) => {
            if (ref.id === referralId && ref.status === 'pending') {
              rewardAmount = ref.rewardEarned;
              return { ...ref, status: 'completed' as const };
            }
            return ref;
          });

          if (rewardAmount > 0) {
            const pointsReward = rewardsClient.creditsToPoints(rewardAmount);
            const newTx: RewardTransaction = {
              id: `tx-${Math.random().toString(36).substr(2, 9)}`,
              points: pointsReward,
              description: `Referral bonus reward (Friend signed up)`,
              type: 'earn',
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            };

            return {
              referrals: updatedReferrals,
              pointsBalance: state.pointsBalance + pointsReward,
              redeemableCredits: state.redeemableCredits + rewardAmount,
              transactions: [newTx, ...state.transactions],
              unlockedAchievements: state.unlockedAchievements.includes('friendly_sharer')
                ? state.unlockedAchievements
                : [...state.unlockedAchievements, 'friendly_sharer'],
            };
          }

          return { referrals: updatedReferrals };
        }),

      incrementStreak: () =>
        set((state) => {
          const newStreak = state.streakDays + 1;
          let pointsBonus = 0;

          if (newStreak === 3) {
            pointsBonus = 50;
          }

          const newTxList = [...state.transactions];
          if (pointsBonus > 0) {
            newTxList.unshift({
              id: `tx-${Math.random().toString(36).substr(2, 9)}`,
              points: pointsBonus,
              description: `3-Day Streak Ordering Bonus!`,
              type: 'earn',
              date: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            });
          }

          const unlocked = [...state.unlockedAchievements];
          if (newStreak >= 3 && !unlocked.includes('streak_3')) {
            unlocked.push('streak_3');
          }

          return {
            streakDays: newStreak,
            lastOrderDate: new Date().toISOString().split('T')[0],
            pointsBalance: state.pointsBalance + pointsBonus,
            transactions: newTxList,
            unlockedAchievements: unlocked,
          };
        }),

      resetStreak: () => set({ streakDays: 0 }),

      unlockAchievement: (id) =>
        set((state) => {
          if (state.unlockedAchievements.includes(id)) return {};
          return { unlockedAchievements: [...state.unlockedAchievements, id] };
        }),

      updateSavings: (updater) =>
        set((state) => ({
          savings: { ...state.savings, ...updater },
        })),

      setRedemptionModalOpen: (open) => set({ redemptionModalOpen: open }),

      resetLoyaltyStore: () => set(DEFAULT_LOYALTY_STATE),
    }),
    {
      name: 'feasto-loyalty-store',
    }
  )
);
