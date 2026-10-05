import { apiClient } from './client';
import { AdminOverviewMetrics } from '@/types/api/admin';

export const adminApi = {
  getOverview(): Promise<AdminOverviewMetrics> {
    return apiClient.get<AdminOverviewMetrics>('/admin/overview');
  },

  listUsers(): Promise<any[]> {
    return apiClient.get<any[]>('/admin/users');
  },

  suspendUser(userId: string, reason: string): Promise<any> {
    return apiClient.post<any>(`/admin/users/${userId}/suspend`, { reason });
  },
};
