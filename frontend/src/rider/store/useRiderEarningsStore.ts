import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  EarningsSummary,
  TripEarningsBreakdown,
  RiderWalletState,
  PayoutRecord,
  QuestBonusItem,
  DeductionItem,
  SmartAIEarningsInsight,
} from '../types/earnings';
import { riderRepository } from '../../repositories/rider/riderRepository';

interface RiderEarningsState {
  summary: EarningsSummary;
  trips: TripEarningsBreakdown[];
  wallet: RiderWalletState;
  payouts: PayoutRecord[];
  bonuses: QuestBonusItem[];
  deductions: DeductionItem[];
  aiInsight: SmartAIEarningsInsight;
  isTransferModalOpen: boolean;

  // Actions
  initiateInstantTransfer: () => void;
  setTransferModalOpen: (isOpen: boolean) => void;
  subscribeLiveEarnings: (riderId: string) => () => void;
}

const EMPTY_SUMMARY: EarningsSummary = {
  todayTotal: 0,
  weeklyTotal: 0,
  monthlyTotal: 0,
  basePayTotal: 0,
  distancePayTotal: 0,
  surgeBonusTotal: 0,
  customerTipsTotal: 0,
  completedTripsCount: 0,
  netEarnings: 0,
};

const EMPTY_WALLET: RiderWalletState = {
  availableBalance: 0,
  pendingBalance: 0,
  lockedBalance: 0,
  lastPayoutDate: 'No recent payouts',
  bankAccountMasked: 'Not linked',
  bankName: 'Pending verification',
  ifscCode: '',
  upiId: '',
  autoPayoutEnabled: false,
};

const INITIAL_AI_INSIGHT: SmartAIEarningsInsight = {
  forecastedWeeklyEarnings: 0,
  peakEarningHours: 'Lunch 12:00 - 15:00 / Dinner 19:30 - 22:00',
  bestEarningZone: 'Bandra West & Khar Zone',
  targetProgressPct: 0,
  bonusOptimizationTip: 'Go online during dinner surge hours to maximize trip offers and tips.',
};

export const useRiderEarningsStore = create<RiderEarningsState>()(
  persist(
    (set, get) => ({
      summary: EMPTY_SUMMARY,
      trips: [],
      wallet: EMPTY_WALLET,
      payouts: [],
      bonuses: [],
      deductions: [],
      aiInsight: INITIAL_AI_INSIGHT,
      isTransferModalOpen: false,

      initiateInstantTransfer: () =>
        set((state) => {
          if (state.wallet.availableBalance <= 0) return state;
          const transferredAmount = state.wallet.availableBalance;

          return {
            wallet: {
              ...state.wallet,
              availableBalance: 0,
              lastPayoutDate: 'Just now',
            },
            payouts: [
              {
                id: `pay_${Date.now()}`,
                amount: transferredAmount,
                payoutMethod: 'upi_instant',
                accountMasked: state.wallet.upiId || 'Linked Bank',
                status: 'completed',
                timestamp: 'Just now',
                referenceTxnId: `TXN-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
              },
              ...state.payouts,
            ],
            isTransferModalOpen: false,
          };
        }),

      setTransferModalOpen: (isTransferModalOpen) => set({ isTransferModalOpen }),

      subscribeLiveEarnings: (riderId: string) => {
        return riderRepository.subscribeRiderEarnings(riderId, (data) => {
          if (data) {
            set({ summary: data.summary || EMPTY_SUMMARY, wallet: data.wallet || EMPTY_WALLET });
          }
        });
      },
    }),
    {
      name: 'feasto-rider-earnings-store-d8',
    }
  )
);

export default useRiderEarningsStore;
