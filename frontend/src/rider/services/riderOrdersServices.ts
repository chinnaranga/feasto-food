import type { DeliveryOfferItem, DeclineReason } from '../types/orders';

export const riderOrdersServices = {
  async fetchAvailableOffers(): Promise<DeliveryOfferItem[]> {
    return [];
  },

  async acceptOffer(offerId: string): Promise<{ success: boolean; activeOrderId: string }> {
    return { success: true, activeOrderId: offerId };
  },

  async declineOffer(offerId: string, reason: DeclineReason): Promise<{ success: boolean }> {
    return { success: true };
  },

  async fetchPriorityOffers(): Promise<DeliveryOfferItem[]> {
    return [];
  },

  getFirestoreOfferListenerConfig() {
    return {
      firestoreCollection: 'delivery_offers',
      snapshotFilter: 'status == "available"',
      expirationTimerSeconds: 60,
      pushNotificationTopic: 'rider_new_offers',
    };
  },
};

export default riderOrdersServices;
