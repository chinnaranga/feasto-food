import { apiClient } from './client';
import { DeliveryOffer, DeliveryAssignment } from '@/types/api/rider';

export const riderApi = {
  getOffers(): Promise<DeliveryOffer[]> {
    return apiClient.get<DeliveryOffer[]>('/rider/offers');
  },

  acceptOffer(offerId: string): Promise<DeliveryAssignment> {
    return apiClient.post<DeliveryAssignment>(`/rider/offers/${offerId}/accept`);
  },

  rejectOffer(offerId: string, reason?: string): Promise<void> {
    return apiClient.post<void>(`/rider/offers/${offerId}/reject`, { reason });
  },

  getAssignments(): Promise<DeliveryAssignment[]> {
    return apiClient.get<DeliveryAssignment[]>('/rider/assignments');
  },
};
