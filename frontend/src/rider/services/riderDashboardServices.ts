import type { DailyOperationalSummary, OperationalAlert, RiderDutyState } from '../types/dashboard';

export const riderDashboardServices = {
  async fetchDailySummary(): Promise<DailyOperationalSummary> {
    return {
      todayEarnings: 1420.0,
      todayTrips: 12,
      todayTips: 180.0,
      todayOnlineMinutes: 320,
      todayDistanceKm: 42.5,
      availableOffersCount: 2,
      questBonusEarned: 250.0,
      acceptanceRatePct: 98,
    };
  },

  async updateDutyState(dutyState: RiderDutyState): Promise<{ success: boolean }> {
    return { success: true };
  },

  async fetchActiveAlerts(): Promise<OperationalAlert[]> {
    return [];
  },

  getFirestoreLiveStatusConfig() {
    return {
      riderStatusCollection: 'rider_live_status',
      geohashTrackingEnabled: true,
      alertTopicName: 'rider_zone_surge_alerts',
    };
  },
};

export default riderDashboardServices;
