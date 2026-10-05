import { apiClient } from './client';
import { UserProfileResponse, UserAddress } from '@/types/api/user';

export const userApi = {
  getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>('/users/me');
  },

  updateProfile(data: Partial<UserProfileResponse>): Promise<UserProfileResponse> {
    return apiClient.patch<UserProfileResponse>('/users/me', data);
  },

  addAddress(address: UserAddress): Promise<UserAddress[]> {
    return apiClient.post<UserAddress[]>('/users/me/addresses', address);
  },
};
