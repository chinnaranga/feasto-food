import { apiClient } from './client';
import { RestaurantItem } from '@/types/api/restaurant';

export const restaurantApi = {
  getRestaurants(): Promise<RestaurantItem[]> {
    return apiClient.get<RestaurantItem[]>('/restaurants');
  },

  getRestaurantById(restaurantId: string): Promise<RestaurantItem> {
    return apiClient.get<RestaurantItem>(`/restaurants/${restaurantId}`);
  },
};
