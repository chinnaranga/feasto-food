import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface VariantOption {
  id: string;
  label: string; // e.g. "Small", "Large", "Half", "Full"
  priceAdjustment: number; // e.g. +50, -20
  available: boolean;
}

export interface AddonOption {
  id: string;
  name: string; // e.g. "Extra Cheese", "Truffle Oil"
  price: number;
  available: boolean;
}

export interface ChannelAvailability {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  lateNight: boolean;
  weekdays: boolean;
  weekends: boolean;
  tempDisabled: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string; // Starters, Mains, Desserts, Beverages
  subcategory: string; // e.g. "Nigiri", "Tempura", "Mochi"
  basePrice: number;
  discountPrice?: number;
  packagingCharge: number;
  status: 'published' | 'draft' | 'archived';
  dietary: 'veg' | 'non-veg' | 'vegan' | 'jain' | 'halal';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  allergens: string[];
  tags: string[];
  images: string[];
  primaryImage?: string;
  variants: VariantOption[];
  addons: AddonOption[];
  availability: ChannelAvailability;
}

interface MenuState {
  items: MenuItem[];
  categories: string[];
  searchQuery: string;
  selectedItemIds: string[];
  filters: {
    status: 'all' | 'published' | 'draft' | 'archived';
    category: string;
    dietary: 'all' | 'veg' | 'non-veg' | 'vegan' | 'jain' | 'halal';
  };

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedItemIds: (ids: string[]) => void;
  toggleSelectItem: (id: string) => void;
  setFilter: (key: 'status' | 'category' | 'dietary', value: string) => void;
  clearFilters: () => void;

  createMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  duplicateMenuItem: (id: string) => void;

  // Bulk actions
  bulkPublish: () => void;
  bulkArchive: () => void;
  bulkDelete: () => void;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-101',
    name: 'Truffle Mushroom Risotto',
    description: 'Arborio rice slow-cooked with wild forest mushrooms, black truffle oil, and aged parmesan shaving.',
    category: 'Mains',
    subcategory: 'Risottos & Pastas',
    basePrice: 420,
    discountPrice: 380,
    packagingCharge: 25,
    status: 'published',
    dietary: 'veg',
    calories: 520,
    protein: 14,
    carbs: 65,
    fat: 22,
    allergens: ['Dairy', 'Wheat'],
    tags: ['Chef Special', 'Best Seller', 'Gourmet'],
    images: ['https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop',
    variants: [
      { id: 'v1', label: 'Half Portion', priceAdjustment: -120, available: true },
      { id: 'v2', label: 'Full Portion', priceAdjustment: 0, available: true },
    ],
    addons: [
      { id: 'a1', name: 'Extra Truffle Oil Shave', price: 60, available: true },
      { id: 'a2', name: 'Garlic Butter Toast', price: 40, available: true },
    ],
    availability: { breakfast: false, lunch: true, dinner: true, lateNight: true, weekdays: true, weekends: true, tempDisabled: false },
  },
  {
    id: 'item-102',
    name: 'Wood-Fired Margherita Pizza',
    description: 'Neapolitan style sourdough crust topped with San Marzano tomato reduction, fresh fior di latte, and basil leaves.',
    category: 'Mains',
    subcategory: 'Artisanal Pizzas',
    basePrice: 380,
    packagingCharge: 30,
    status: 'published',
    dietary: 'veg',
    calories: 680,
    protein: 24,
    carbs: 85,
    fat: 28,
    allergens: ['Dairy', 'Wheat'],
    tags: ['Organic', 'Wood-Fired'],
    images: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop',
    variants: [],
    addons: [{ id: 'a3', name: 'Extra Mozzarella Cheese', price: 50, available: true }],
    availability: { breakfast: false, lunch: true, dinner: true, lateNight: false, weekdays: true, weekends: true, tempDisabled: false },
  },
  {
    id: 'item-103',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes simmered in a velvety cashew and tomato gravy infused with aromatic fenugreek leaves.',
    category: 'Mains',
    subcategory: 'North Indian Curries',
    basePrice: 320,
    discountPrice: 290,
    packagingCharge: 20,
    status: 'published',
    dietary: 'veg',
    calories: 450,
    protein: 18,
    carbs: 22,
    fat: 32,
    allergens: ['Dairy', 'Nuts'],
    tags: ['Classic', 'Popular'],
    images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop',
    variants: [],
    addons: [{ id: 'a4', name: 'Butter Naan (2 pcs)', price: 60, available: true }],
    availability: { breakfast: false, lunch: true, dinner: true, lateNight: true, weekdays: true, weekends: true, tempDisabled: false },
  },
  {
    id: 'item-104',
    name: 'Crispy Avocado Tacos',
    description: 'Tempura fried Hass avocado slices served in handmade corn tortillas with chipotle crema and lime slaw.',
    category: 'Starters',
    subcategory: 'Mexican Starters',
    basePrice: 290,
    packagingCharge: 15,
    status: 'published',
    dietary: 'vegan',
    calories: 340,
    protein: 8,
    carbs: 42,
    fat: 16,
    allergens: ['Wheat'],
    tags: ['Vegan', 'Gluten-Free Option'],
    images: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
    variants: [],
    addons: [],
    availability: { breakfast: true, lunch: true, dinner: true, lateNight: false, weekdays: true, weekends: true, tempDisabled: false },
  },
  {
    id: 'item-105',
    name: 'Classic Tiramisu',
    description: 'Traditional Italian dessert made with espresso-soaked ladyfingers, whipped mascarpone cream, and cocoa dusting.',
    category: 'Desserts',
    subcategory: 'Italian Desserts',
    basePrice: 260,
    packagingCharge: 20,
    status: 'published',
    dietary: 'veg',
    calories: 380,
    protein: 6,
    carbs: 45,
    fat: 20,
    allergens: ['Dairy', 'Wheat'],
    tags: ['Dessert', 'Sweet'],
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
    variants: [],
    addons: [],
    availability: { breakfast: false, lunch: true, dinner: true, lateNight: true, weekdays: true, weekends: true, tempDisabled: false },
  },
  {
    id: 'item-106',
    name: 'Artisanal Cold Brew Coffee',
    description: 'Single-origin 18-hour cold steeped Arabica beans served over crystal ice spheres with optional oat milk.',
    category: 'Beverages',
    subcategory: 'Craft Cold Brews',
    basePrice: 180,
    packagingCharge: 10,
    status: 'published',
    dietary: 'vegan',
    calories: 90,
    protein: 2,
    carbs: 12,
    fat: 3,
    allergens: [],
    tags: ['Cold Brew', 'Zero Sugar Option'],
    images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop'],
    primaryImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop',
    variants: [],
    addons: [],
    availability: { breakfast: true, lunch: true, dinner: true, lateNight: true, weekdays: true, weekends: true, tempDisabled: false },
  },
];

// ─── Menu Store ──────────────────────────────────────────────────────────────
export const usePortalMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      items: DEFAULT_MENU_ITEMS,
      categories: ['Starters', 'Mains & Platters', 'Sweet Desserts', 'Cold & Hot Beverages'],
      searchQuery: '',
      selectedItemIds: [],
      filters: {
        status: 'all',
        category: 'all',
        dietary: 'all',
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
            status: 'all',
            category: 'all',
            dietary: 'all',
          },
        });
      },

      createMenuItem: (item) => {
        const id = `item-${Date.now()}`;
        const newItem: MenuItem = {
          ...item,
          id,
        };
        // 1. Immediately update Zustand local state so UI updates instantly
        set((state) => ({ items: [newItem, ...state.items] }));

        // 2. Persist asynchronously to Cloud Firestore database
        firestoreService.setDocument(`portal_menu_items/${id}`, newItem).catch((err) => {
          console.warn('⚠️ Cloud Firestore menu write warning:', err);
        });
      },

      updateMenuItem: (id, updates) => {
        // 1. Immediately update Zustand local state
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));

        // 2. Persist asynchronously to Cloud Firestore database
        firestoreService.setDocument(`portal_menu_items/${id}`, updates).catch((err) => {
          console.warn('⚠️ Cloud Firestore menu update warning:', err);
        });
      },

      deleteMenuItem: (id) => {
        // 1. Immediately update Zustand local state
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        // 2. Delete from Cloud Firestore database
        firestoreService.deleteDocument(`portal_menu_items/${id}`).catch((err) => {
          console.warn('⚠️ Cloud Firestore menu delete warning:', err);
        });
      },

      duplicateMenuItem: (id) => {
        const match = get().items.find((item) => item.id === id);
        if (match) {
          const duplicateId = `item-${Date.now()}`;
          const duplicate: MenuItem = {
            ...match,
            id: duplicateId,
            name: `${match.name} (Copy)`,
            status: 'draft',
          };
          set((state) => ({ items: [duplicate, ...state.items] }));
          firestoreService.setDocument(`portal_menu_items/${duplicateId}`, duplicate).catch((err) => {
            console.warn('⚠️ Cloud Firestore duplicate item warning:', err);
          });
        }
      },

      bulkPublish: () => {
        const { selectedItemIds } = get();
        set((state) => ({
          items: state.items.map((item) =>
            selectedItemIds.includes(item.id) ? { ...item, status: 'published' as const } : item
          ),
          selectedItemIds: [],
        }));
        selectedItemIds.forEach((id) => {
          firestoreService.setDocument(`portal_menu_items/${id}`, { status: 'published' }).catch(() => {});
        });
      },

      bulkArchive: () => {
        const { selectedItemIds } = get();
        set((state) => ({
          items: state.items.map((item) =>
            selectedItemIds.includes(item.id) ? { ...item, status: 'archived' as const } : item
          ),
          selectedItemIds: [],
        }));
        selectedItemIds.forEach((id) => {
          firestoreService.setDocument(`portal_menu_items/${id}`, { status: 'archived' }).catch(() => {});
        });
      },

      bulkDelete: () => {
        const { selectedItemIds } = get();
        set((state) => ({
          items: state.items.filter((item) => !selectedItemIds.includes(item.id)),
          selectedItemIds: [],
        }));
        selectedItemIds.forEach((id) => {
          firestoreService.deleteDocument(`portal_menu_items/${id}`).catch(() => {});
        });
      },
    }),
    {
      name: 'feasto-merchant-menu-store-v3',
      partialize: (state) => ({
        items: state.items,
        categories: state.categories,
      }),
    }
  )
);

export default usePortalMenuStore;
