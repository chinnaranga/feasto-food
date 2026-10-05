import { create } from 'zustand';
import type { MenuItem, Addon } from '@/data/restaurants';

export interface SelectedAddon {
  groupId: string;
  groupName: string;
  addon: Addon;
}

export interface ItemDraft {
  item: MenuItem;
  restaurantId: string;
  quantity: number;
  selectedAddons: SelectedAddon[];
  spiceLevel: string;
  specialInstructions: string;
  totalPrice: number;
}

interface MenuState {
  menuSearchQuery: string;
  activeMenuFilters: string[];
  customizingItem: ItemDraft | null;
  setMenuSearchQuery: (q: string) => void;
  toggleMenuFilter: (filter: string) => void;
  clearMenuFilters: () => void;
  openCustomization: (item: MenuItem, restaurantId: string) => void;
  closeCustomization: () => void;
  setQuantity: (qty: number) => void;
  toggleAddon: (groupId: string, groupName: string, addon: Addon, maxSelections: number) => void;
  setSpiceLevel: (level: string) => void;
  setSpecialInstructions: (notes: string) => void;
}

const calcTotal = (draft: ItemDraft): number => {
  const addonsTotal = draft.selectedAddons.reduce((sum, sa) => sum + sa.addon.price, 0);
  return (draft.item.price + addonsTotal) * draft.quantity;
};

export const MENU_FILTER_OPTIONS = [
  { id: 'Vegetarian', label: '🥦 Veg', tag: 'Vegetarian' },
  { id: 'Vegan', label: '🌱 Vegan', tag: 'Vegan' },
  { id: 'Gluten Free', label: 'GF', tag: 'Gluten Free' },
  { id: 'High Protein', label: '💪 Protein', tag: 'High Protein' },
  { id: 'Healthy', label: '💚 Healthy', tag: 'Healthy' },
  { id: 'Popular', label: '🔥 Popular', tag: 'Popular' },
];

export const useMenuStore = create<MenuState>((set) => ({
  menuSearchQuery: '',
  activeMenuFilters: [],
  customizingItem: null,

  setMenuSearchQuery: (menuSearchQuery) => set({ menuSearchQuery }),

  toggleMenuFilter: (filter) =>
    set((state) => ({
      activeMenuFilters: state.activeMenuFilters.includes(filter)
        ? state.activeMenuFilters.filter((f) => f !== filter)
        : [...state.activeMenuFilters, filter],
    })),

  clearMenuFilters: () => set({ activeMenuFilters: [] }),

  openCustomization: (item, restaurantId) => {
    const defaultAddons: SelectedAddon[] = [];
    item.addonGroups?.forEach((group) => {
      group.options.filter((o) => o.isDefault).forEach((o) => {
        defaultAddons.push({ groupId: group.id, groupName: group.name, addon: o });
      });
    });
    const draft: ItemDraft = {
      item,
      restaurantId,
      quantity: 1,
      selectedAddons: defaultAddons,
      spiceLevel: 'mild',
      specialInstructions: '',
      totalPrice: item.price,
    };
    set({ customizingItem: { ...draft, totalPrice: calcTotal(draft) } });
  },

  closeCustomization: () => set({ customizingItem: null }),

  setQuantity: (qty) =>
    set((state) => {
      if (!state.customizingItem) return state;
      const updated = { ...state.customizingItem, quantity: Math.max(1, qty) };
      return { customizingItem: { ...updated, totalPrice: calcTotal(updated) } };
    }),

  toggleAddon: (groupId, groupName, addon, maxSelections) =>
    set((state) => {
      if (!state.customizingItem) return state;
      const current = state.customizingItem.selectedAddons;
      const alreadySelected = current.find(
        (sa) => sa.groupId === groupId && sa.addon.id === addon.id
      );
      let updated: SelectedAddon[];
      if (alreadySelected) {
        updated = current.filter((sa) => !(sa.groupId === groupId && sa.addon.id === addon.id));
      } else {
        const groupSelected = current.filter((sa) => sa.groupId === groupId);
        if (maxSelections === 1) {
          updated = [
            ...current.filter((sa) => sa.groupId !== groupId),
            { groupId, groupName, addon },
          ];
        } else if (groupSelected.length < maxSelections) {
          updated = [...current, { groupId, groupName, addon }];
        } else {
          updated = current;
        }
      }
      const draft = { ...state.customizingItem, selectedAddons: updated };
      return { customizingItem: { ...draft, totalPrice: calcTotal(draft) } };
    }),

  setSpiceLevel: (spiceLevel) =>
    set((state) =>
      state.customizingItem
        ? { customizingItem: { ...state.customizingItem, spiceLevel } }
        : state
    ),

  setSpecialInstructions: (specialInstructions) =>
    set((state) =>
      state.customizingItem
        ? { customizingItem: { ...state.customizingItem, specialInstructions } }
        : state
    ),
}));

export default useMenuStore;
