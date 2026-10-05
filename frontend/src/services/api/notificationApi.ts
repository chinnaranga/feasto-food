import { apiClient } from './client';
import { NotificationItem } from '@/types/api/notification';

export const notificationApi = {
  getNotifications(): Promise<NotificationItem[]> {
    return apiClient.get<NotificationItem[]>('/notifications');
  },

  markAsRead(notificationId: string): Promise<void> {
    return apiClient.patch<void>(`/notifications/${notificationId}/read`);
  },
};
