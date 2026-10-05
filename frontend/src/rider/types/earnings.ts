// ─── Stage D8 Rider Earnings, Wallet & Payout Management Types ─────────────

export type EarningsTimeframe = 'today' | 'weekly' | 'monthly';

export type PayoutStatus = 'completed' | 'processing' | 'pending' | 'failed';

export interface EarningsSummary {
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  basePayTotal: number;
  distancePayTotal: number;
  surgeBonusTotal: number;
  customerTipsTotal: number;
  completedTripsCount: number;
  netEarnings: number;
}

export interface TripEarningsBreakdown {
  id: string;
  orderNumber: string;
  restaurantName: string;
  timestamp: string;
  basePay: number;
  distancePay: number;
  surgeBonus: number;
  tipAmount: number;
  deductionsAmount: number;
  netPay: number;
}

export interface RiderWalletState {
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  lastPayoutDate: string;
  bankAccountMasked: string;
  bankName: string;
  ifscCode: string;
  upiId: string;
  autoPayoutEnabled: boolean;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  payoutMethod: 'bank_transfer' | 'upi_instant';
  accountMasked: string;
  status: PayoutStatus;
  timestamp: string;
  referenceTxnId: string;
}

export interface QuestBonusItem {
  id: string;
  title: string;
  description: string;
  targetTrips: number;
  completedTrips: number;
  bonusRewardAmount: number;
  expiryTime: string;
  isUnlocked: boolean;
}

export interface DeductionItem {
  id: string;
  title: string;
  category: 'platform_fee' | 'policy_penalty' | 'late_prep' | 'tax_tds';
  amount: number;
  timestamp: string;
  reasonNote: string;
}

export interface SmartAIEarningsInsight {
  forecastedWeeklyEarnings: number;
  peakEarningHours: string;
  bestEarningZone: string;
  targetProgressPct: number;
  bonusOptimizationTip: string;
}
