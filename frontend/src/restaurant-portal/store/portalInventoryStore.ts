import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface SupplierRecord {
  name: string;
  contact: string;
  phone: string;
  email: string;
  leadTimeDays: number;
  preferred: boolean;
}

export interface WasteRecord {
  id: string;
  quantity: number;
  reason: 'expired' | 'spoilage' | 'damaged' | 'kitchen-waste' | 'incorrect-prep' | 'customer-return' | 'theft' | 'other';
  timestamp: string;
  note: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: 'ingredients' | 'raw-materials' | 'packaging' | 'finished-goods' | 'beverages' | 'other';
  currentQuantity: number;
  reservedQuantity: number;
  safetyStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: 'kg' | 'g' | 'litre' | 'ml' | 'piece' | 'pack' | 'box' | 'l' | 'packet' | 'bottle';
  location: 'cold-storage' | 'dry-storage' | 'shelf' | 'warehouse' | 'kitchen' | 'freezer';
  supplier: SupplierRecord;
  mfgDate?: string;
  expiryDate?: string;
  recipeMenuIds: string[]; // references MenuItem.id from portalMenuStore
  wasteLogs: WasteRecord[];
}

interface InventoryState {
  items: StockItem[];
  searchQuery: string;
  selectedItemIds: string[];
  filters: {
    category: string;
    location: string;
    expiryAlert: 'all' | 'expired' | 'near-expiry' | 'healthy';
  };

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedItemIds: (ids: string[]) => void;
  toggleSelectItem: (id: string) => void;
  setFilter: (key: 'category' | 'location' | 'expiryAlert', value: string) => void;
  clearFilters: () => void;

  createIngredient: (item: Omit<StockItem, 'id' | 'wasteLogs'>) => void;
  updateIngredient: (id: string, updates: Partial<StockItem>) => void;
  deleteIngredient: (id: string) => void;
  adjustStockQuantity: (id: string, delta: number, note?: string) => void;
  logWasteItem: (id: string, record: Omit<WasteRecord, 'id' | 'timestamp'>) => void;

  // Bulk actions
  bulkReorderSuggestions: () => string[];
}

// ─── Inventory Store ──────────────────────────────────────────────────────────
export const usePortalInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      searchQuery: '',
      selectedItemIds: [],
      filters: {
        category: 'all',
        location: 'all',
        expiryAlert: 'all',
      },

      setSearchQuery: (q) => set({ searchQuery: q }),

      setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),

      toggleSelectItem: (id) => {
        set((state) => {
          const isSelected = state.selectedItemIds.includes(id);
          const selectedItemIds = isSelected
            ? state.selectedItemIds.filter((item) => item !== id)
            : [...state.selectedItemIds, id];
          return { selectedItemIds };
        });
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            category: 'all',
            location: 'all',
            expiryAlert: 'all',
          },
        });
      },

      createIngredient: (item) => {
        const id = `stock-${Date.now()}`;
        const newItem: StockItem = {
          ...item,
          id,
          wasteLogs: [],
        };
        firestoreService.setDocument(`portal_stock_items/${id}`, newItem);
      },

      updateIngredient: (id, updates) => {
        firestoreService.setDocument(`portal_stock_items/${id}`, updates);
      },

      deleteIngredient: (id) => {
        firestoreService.deleteDocument(`portal_stock_items/${id}`);
      },

      adjustStockQuantity: (id, delta, _note) => {
        const match = get().items.find((item) => item.id === id);
        if (match) {
          const updatedQty = Math.max(0, match.currentQuantity + delta);
          firestoreService.setDocument(`portal_stock_items/${id}`, { currentQuantity: updatedQty });
        }
      },

      logWasteItem: (id, record) => {
        const match = get().items.find((item) => item.id === id);
        if (match) {
          const cleanQty = Math.max(0, match.currentQuantity - record.quantity);
          const newWaste: WasteRecord = {
            ...record,
            id: `w-${Date.now()}`,
            timestamp: new Date().toISOString(),
          };
          firestoreService.setDocument(`portal_stock_items/${id}`, {
            currentQuantity: cleanQty,
            wasteLogs: [newWaste, ...match.wasteLogs],
          });
        }
      },

      bulkReorderSuggestions: () => {
        const { items } = get();
        return items
          .filter((i) => i.currentQuantity <= i.reorderPoint)
          .map((i) => i.id);
      },
    }),
    {
      name: 'feasto-merchant-inventory-store-v2',
      partialize: (state) => ({
        selectedItemIds: state.selectedItemIds,
      }),
    }
  )
);

export default usePortalInventoryStore;
