import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RiderDutyState,
  DailyOperationalSummary,
  OperationalAlert,
  TodayShiftSchedule,
  RiderActivityItem,
  SmartAIDashboardInsight,
} from '../types/dashboard';

interface RiderDashboardState {
  dutyState: RiderDutyState;
  assignedZone: string;
  summary: DailyOperationalSummary;
  alerts: OperationalAlert[];
  schedule: TodayShiftSchedule;
  activities: RiderActivityItem[];
  aiInsight: SmartAIDashboardInsight;
  isDutyModalOpen: boolean;

  // Actions
  setDutyState: (state: RiderDutyState) => void;
  toggleDutyState: () => void;
  setAssignedZone: (zone: string) => void;

  dismissAlert: (alertId: string) => void;
  markAlertRead: (alertId: string) => void;

  toggleBreakMode: () => void;
  setDutyModalOpen: (isOpen: boolean) => void;
}

const EMPTY_SUMMARY: DailyOperationalSummary = {
  todayEarnings: 0,
  todayTrips: 0,
  todayTips: 0,
  todayOnlineMinutes: 0,
  todayDistanceKm: 0,
  availableOffersCount: 0,
  activeOrderNumber: '',
  questBonusEarned: 0,
  acceptanceRatePct: 100,
};

const INITIAL_SCHEDULE: TodayShiftSchedule = {
  shiftName: 'Standard Courier Shift',
  startTime: '09:00',
  endTime: '22:00',
  isActive: true,
  breakWindowTime: 'Flexible',
  peakDemandStatus: 'normal',
  suggestedZone: 'Primary Zone',
};

const INITIAL_AI_INSIGHT: SmartAIDashboardInsight = {
  bestTimeToOnline: 'Lunch 12:00 - 15:00 / Dinner 19:30 - 22:00',
  earningsOptimizationTip: 'Stay online in high-density restaurant hubs to receive instant order dispatches.',
  zoneDemandRating: '● Moderate',
  peakHourSuggestion: 'Expect higher order volumes during peak dinner hours.',
};

export const useRiderDashboardStore = create<RiderDashboardState>()(
  persist(
    (set, get) => ({
      dutyState: 'online',
      assignedZone: 'Primary Operational Zone',
      summary: EMPTY_SUMMARY,
      alerts: [],
      schedule: INITIAL_SCHEDULE,
      activities: [],
      aiInsight: INITIAL_AI_INSIGHT,
      isDutyModalOpen: false,

      setDutyState: (dutyState) => set({ dutyState }),

      toggleDutyState: () =>
        set((state) => ({
          dutyState: state.dutyState === 'online' ? 'offline' : 'online',
        })),

      setAssignedZone: (assignedZone) => set({ assignedZone }),

      dismissAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        })),

      markAlertRead: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
        })),

      toggleBreakMode: () =>
        set((state) => ({
          dutyState: state.dutyState === 'break_mode' ? 'online' : 'break_mode',
        })),

      setDutyModalOpen: (isDutyModalOpen) => set({ isDutyModalOpen }),
    }),
    {
      name: 'feasto-rider-dashboard-store-d4',
    }
  )
);

export default useRiderDashboardStore;
