import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RestaurantContext } from '../types/portal';
import { MOCK_RESTAURANTS } from '../constants/portal';

interface PortalState {
  sidebarCollapsed: boolean;
  selectedRestaurant: RestaurantContext | null;
  restaurants: RestaurantContext[];
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  selectRestaurant: (id: string) => void;
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      selectedRestaurant: MOCK_RESTAURANTS[0],
      restaurants: MOCK_RESTAURANTS,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      selectRestaurant: (id) => {
        const match = get().restaurants.find((r) => r.id === id);
        if (match) {
          set({ selectedRestaurant: match });
        }
      },
    }),
    {
      name: 'feasto-restaurant-portal-context',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        selectedRestaurant: state.selectedRestaurant,
      }),
    }
  )
);
export default usePortalStore;
