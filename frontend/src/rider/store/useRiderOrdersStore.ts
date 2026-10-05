import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DeliveryOfferItem,
  OrderFilterCriteria,
  OrderSortOption,
  DeclineReason,
} from '../types/orders';
import { riderRepository } from '../../repositories/rider/riderRepository';

interface RiderOrdersState {
  offers: DeliveryOfferItem[];
  selectedOfferId: string | null;
  filters: OrderFilterCriteria;
  sortOption: OrderSortOption;
  isDeclineModalOpen: boolean;
  declinedOfferId: string | null;

  // Actions
  setOffers: (offers: DeliveryOfferItem[]) => void;
  selectOffer: (id: string | null) => void;

  acceptOffer: (id: string) => DeliveryOfferItem | null;
  declineOffer: (id: string, reason: DeclineReason) => void;

  setFilters: (filters: Partial<OrderFilterCriteria>) => void;
  setSortOption: (sort: OrderSortOption) => void;

  openDeclineModal: (id: string) => void;
  closeDeclineModal: () => void;
  subscribeLiveOffers: (zoneName?: string) => () => void;
}

const INITIAL_FILTERS: OrderFilterCriteria = {
  zone: 'all',
  deliveryType: 'all',
  priorityOnly: false,
  minPayout: 0,
};

export const useRiderOrdersStore = create<RiderOrdersState>()(
  persist(
    (set, get) => ({
      offers: [],
      selectedOfferId: null,
      filters: INITIAL_FILTERS,
      sortOption: 'payout_high',
      isDeclineModalOpen: false,
      declinedOfferId: null,

      setOffers: (offers) => set({ offers, selectedOfferId: offers[0]?.id || null }),
      selectOffer: (selectedOfferId) => set({ selectedOfferId }),

      acceptOffer: (id) => {
        const offer = get().offers.find((o) => o.id === id);
        if (!offer) return null;

        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, status: 'accepted' } : o)),
          selectedOfferId: null,
        }));

        return offer;
      },

      declineOffer: (id, _reason) =>
        set((state) => ({
          offers: state.offers.map((o) => (o.id === id ? { ...o, status: 'declined' } : o)),
          isDeclineModalOpen: false,
          declinedOfferId: null,
        })),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setSortOption: (sortOption) => set({ sortOption }),

      openDeclineModal: (id) => set({ isDeclineModalOpen: true, declinedOfferId: id }),
      closeDeclineModal: () => set({ isDeclineModalOpen: false, declinedOfferId: null }),

      subscribeLiveOffers: (zoneName = 'all') => {
        return riderRepository.subscribeAvailableOffers(zoneName, (liveOffers) => {
          set({ offers: liveOffers, selectedOfferId: liveOffers[0]?.id || null });
        });
      },
    }),
    {
      name: 'feasto-rider-orders-store-d5',
    }
  )
);

export default useRiderOrdersStore;
