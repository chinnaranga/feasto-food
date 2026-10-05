import type { DeliveryStage, ActiveDeliveryTask } from '../types/active';

export const riderActiveServices = {
  async fetchActiveDelivery(): Promise<ActiveDeliveryTask | null> {
    return null;
  },

  async updateDeliveryStage(stage: DeliveryStage): Promise<{ success: boolean }> {
    return { success: true };
  },

  async reportExceptionIssue(type: string, notes: string): Promise<{ success: boolean; issueId: string }> {
    return { success: true, issueId: `issue_${Date.now()}` };
  },

  async markDeliveryComplete(orderId: string): Promise<{ success: boolean; earnedAmount: number }> {
    return { success: true, earnedAmount: 220.0 };
  },

  getFirestoreActiveDeliveryConfig() {
    return {
      firestoreCollection: 'active_deliveries',
      realtimeGeohashSync: true,
      stageUpdateTopic: 'rider_active_delivery_updates',
    };
  },
};

export default riderActiveServices;
