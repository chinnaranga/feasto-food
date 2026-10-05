// ─── Stage D4 Rider Dashboard & Daily Operations Home Types ───────────────────

export type RiderDutyState = 'online' | 'offline' | 'on_delivery' | 'break_mode';

export interface DailyOperationalSummary {
  todayEarnings: number;
  todayTrips: number;
  todayTips: number;
  todayOnlineMinutes: number;
  todayDistanceKm: number;
  availableOffersCount: number;
  activeOrderNumber?: string;
  questBonusEarned: number;
  acceptanceRatePct: number;
}

export interface OperationalAlert {
  id: string;
  type: 'document' | 'zone' | 'battery' | 'support' | 'shift' | 'payout';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  isRead: boolean;
  actionPath?: string;
  actionLabel?: string;
}

export interface TodayShiftSchedule {
  shiftName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  breakWindowTime: string;
  peakDemandStatus: 'high_surge' | 'moderate' | 'normal';
  suggestedZone: string;
}

export interface RiderActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'trip' | 'duty' | 'payout' | 'alert' | 'support';
  statusBadge?: string;
}

export interface SmartAIDashboardInsight {
  bestTimeToOnline: string;
  earningsOptimizationTip: string;
  zoneDemandRating: '🔥 Extremely High (1.5x Surge)' | '⚡ High Demand' | '● Moderate';
  peakHourSuggestion: string;
}
