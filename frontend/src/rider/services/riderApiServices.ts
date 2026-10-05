import type { RiderProfile, DeliveryOffer, RiderEarningsSummary, RiderDocumentItem } from '../types';

export const riderApiService = {
  async getProfile(): Promise<Partial<RiderProfile>> {
    return {
      id: 'rdr-101',
      riderCode: 'RDR-8802',
      fullName: 'Arjun Kumar',
      rating: 4.92,
    };
  },

  async updateDutyAvailability(status: 'online' | 'offline'): Promise<{ success: boolean }> {
    return { success: true };
  },

  async fetchAvailableOffers(): Promise<DeliveryOffer[]> {
    return [];
  },

  async acceptOffer(offerId: string): Promise<{ success: boolean; activeOrderId: string }> {
    return { success: true, activeOrderId: offerId };
  },

  async updateDeliveryStepStatus(step: string): Promise<{ success: boolean }> {
    return { success: true };
  },

  async fetchEarningsSummary(): Promise<Partial<RiderEarningsSummary>> {
    return {
      todayEarnings: 1420.0,
      todayTrips: 12,
    };
  },

  async submitDocumentUpload(documentType: string, fileBlob: Blob): Promise<{ success: boolean }> {
    return { success: true };
  },

  async triggerEmergencySOS(): Promise<{ dispatched: boolean; helplinePhone: string }> {
    return { dispatched: true, helplinePhone: '+91 1800 200 9999' };
  },
};

export default riderApiService;
