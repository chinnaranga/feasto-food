import { create } from 'zustand';
import { Restaurant, MOCK_RESTAURANTS } from '@/data/restaurants';

export type SortOption = 'recommended' | 'rating' | 'delivery_time' | 'price_low' | 'price_high';
export type ViewMode = 'grid' | 'list';
export type PriceRange = 'budget' | 'mid' | 'premium' | 'all';

export interface DiscoveryFilters {
  cuisine: string[];
  priceRange: PriceRange;
  minRating: number;
  maxDeliveryTime: number;
  hasOffers: boolean;
  vegetarian: boolean;
  vegan: boolean;
  healthy: boolean;
  spicy: boolean;
  openNow: boolean;
  highProtein: boolean;
  favoritesOnly: boolean;
}

const DEFAULT_FILTERS: DiscoveryFilters = {
  cuisine: [],
  priceRange: 'all',
  minRating: 0,
  maxDeliveryTime: 60,
  hasOffers: false,
  vegetarian: false,
  vegan: false,
  healthy: false,
  spicy: false,
  openNow: false,
  highProtein: false,
  favoritesOnly: false,
};

interface DiscoveryState {
  restaurants: Restaurant[];
  searchQuery: string;
  filters: DiscoveryFilters;
  sortOption: SortOption;
  selectedCuisine: string | null;
  favorites: string[];
  viewMode: ViewMode;
  setRestaurants: (list: Restaurant[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  resetFilters: () => void;
  setSortOption: (option: SortOption) => void;
  setSelectedCuisine: (cuisine: string | null) => void;
  toggleFavorite: (restaurantId: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  restaurants: MOCK_RESTAURANTS,
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  sortOption: 'recommended',
  selectedCuisine: null,
  favorites: [],
  viewMode: 'grid',
  setRestaurants: (list) => {
    if (list && list.length > 0) {
      MOCK_RESTAURANTS.length = 0;
      MOCK_RESTAURANTS.push(...list);
      set({ restaurants: list });
    }
  },
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setSortOption: (sortOption) => set({ sortOption }),
  setSelectedCuisine: (selectedCuisine) => set({ selectedCuisine }),
  toggleFavorite: (restaurantId) =>
    set((state) => ({
      favorites: state.favorites.includes(restaurantId)
        ? state.favorites.filter((id) => id !== restaurantId)
        : [...state.favorites, restaurantId],
    })),
  setViewMode: (viewMode) => set({ viewMode }),
}));
