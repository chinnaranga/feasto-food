import { apiClient } from './client';
import { MenuCategory } from '@/types/api/menu';

export const menuApi = {
  getMenuByRestaurant(restaurantId: string): Promise<MenuCategory[]> {
    return apiClient.get<MenuCategory[]>(`/restaurants/${restaurantId}/menu`);
  },
};
