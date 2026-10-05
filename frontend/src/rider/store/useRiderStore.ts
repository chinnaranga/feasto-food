import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RiderProfile,
  RiderAvailability,
  DeliveryOffer,
  DeliveryStep,
  RiderEarningsSummary,
  RiderVehicleInfo,
  RiderDocumentItem,
} from '../types';
import {
  MOCK_RIDER_PROFILE,
  MOCK_DELIVERY_OFFERS,
  MOCK_EARNINGS_SUMMARY,
  MOCK_VEHICLE_INFO,
  MOCK_DOCUMENTS,
} from '../constants';

interface RiderState {
  profile: RiderProfile;
  availability: RiderAvailability;
  currentZone: string;
  deliveryOffers: DeliveryOffer[];
  activeOffer: DeliveryOffer | null;
  activeDeliveryStep: DeliveryStep;

  earningsSummary: RiderEarningsSummary;
  vehicleInfo: RiderVehicleInfo;
  documents: RiderDocumentItem[];

  isDrawerOpen: boolean;
  unreadNotificationsCount: number;

  // Actions
  setAvailability: (availability: RiderAvailability) => void;
  toggleAvailability: () => void;
  setCurrentZone: (zone: string) => void;

  acceptDeliveryOffer: (offerId: string) => void;
  declineDeliveryOffer: (offerId: string) => void;

  advanceDeliveryStep: () => void;
  completeActiveDelivery: () => void;

  setDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
}

export const useRiderStore = create<RiderState>()(
  persist(
    (set, get) => ({
      profile: MOCK_RIDER_PROFILE,
      availability: 'online',
      currentZone: 'Bandra West & Khar Zone',
      deliveryOffers: MOCK_DELIVERY_OFFERS,
      activeOffer: MOCK_DELIVERY_OFFERS[0],
      activeDeliveryStep: 'arrived_at_store',

      earningsSummary: MOCK_EARNINGS_SUMMARY,
      vehicleInfo: MOCK_VEHICLE_INFO,
      documents: MOCK_DOCUMENTS,

      isDrawerOpen: false,
      unreadNotificationsCount: 2,

      setAvailability: (availability) =>
        set((state) => ({
          availability,
          profile: { ...state.profile, availability },
        })),

      toggleAvailability: () =>
        set((state) => {
          const nextState: RiderAvailability = state.availability === 'online' ? 'offline' : 'online';
          return {
            availability: nextState,
            profile: { ...state.profile, availability: nextState },
          };
        }),

      setCurrentZone: (currentZone) => set({ currentZone }),

      acceptDeliveryOffer: (offerId) =>
        set((state) => {
          const offer = state.deliveryOffers.find((o) => o.id === offerId);
          if (!offer) return state;

          return {
            activeOffer: { ...offer, status: 'accepted' },
            activeDeliveryStep: 'navigating_to_store',
            availability: 'on_delivery',
            deliveryOffers: state.deliveryOffers.filter((o) => o.id !== offerId),
          };
        }),

      declineDeliveryOffer: (offerId) =>
        set((state) => ({
          deliveryOffers: state.deliveryOffers.filter((o) => o.id !== offerId),
        })),

      advanceDeliveryStep: () =>
        set((state) => {
          const stepSequence: DeliveryStep[] = [
            'assigned',
            'navigating_to_store',
            'arrived_at_store',
            'picked_up',
            'navigating_to_diner',
            'arrived_at_diner',
            'delivered',
          ];

          const currentIndex = stepSequence.indexOf(state.activeDeliveryStep);
          if (currentIndex >= 0 && currentIndex < stepSequence.length - 1) {
            const nextStep = stepSequence[currentIndex + 1];
            return { activeDeliveryStep: nextStep };
          }

          return state;
        }),

      completeActiveDelivery: () =>
        set((state) => {
          if (!state.activeOffer) return state;

          const earned = state.activeOffer.payoutAmount + state.activeOffer.tipAmount;
          return {
            activeOffer: null,
            activeDeliveryStep: 'idle',
            availability: 'online',
            earningsSummary: {
              ...state.earningsSummary,
              todayEarnings: state.earningsSummary.todayEarnings + earned,
              todayTrips: state.earningsSummary.todayTrips + 1,
              todayTips: state.earningsSummary.todayTips + state.activeOffer.tipAmount,
            },
          };
        }),

      setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    }),
    {
      name: 'feasto-rider-store-d1',
      partialize: (state) => ({
        availability: state.availability,
        currentZone: state.currentZone,
        earningsSummary: state.earningsSummary,
        vehicleInfo: state.vehicleInfo,
      }),
    }
  )
);

export default useRiderStore;
