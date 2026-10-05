import { apiClient } from './client';
import { LiveTrackingSession } from '@/types/api/tracking';

export const trackingApi = {
  getTrackingByOrder(orderId: string): Promise<LiveTrackingSession> {
    return apiClient.get<LiveTrackingSession>(`/tracking/orders/${orderId}`);
  },

  updateRiderLocation(latitude: number, longitude: number, heading?: number, speed?: number): Promise<void> {
    return apiClient.post<void>('/tracking/location', { latitude, longitude, heading, speed });
  },
};
