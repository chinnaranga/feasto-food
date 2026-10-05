import type { EarningsSummary, RiderWalletState, PayoutRecord } from '../types/earnings';

export const riderEarningsServices = {
  async fetchEarningsSummary(): Promise<EarningsSummary | null> {
    return null;
  },

  async fetchRiderWallet(): Promise<RiderWalletState | null> {
    return null;
  },

  async requestInstantPayout(amount: number): Promise<{ success: boolean; txnId: string }> {
    return { success: true, txnId: `TXN_${Date.now()}` };
  },

  getFirestoreEarningsConfig() {
    return {
      firestoreCollection: 'rider_earnings',
      realtimePayoutListener: true,
      payoutAlertTopic: 'rider_payout_notifications',
    };
  },
};

export default riderEarningsServices;
