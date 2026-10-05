import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface CategoryVisibility {
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "23:00"
  days: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string; // for child/subcategory groupings
  priority: number; // sort index
  status: 'published' | 'archived';
  visibility: CategoryVisibility;
}

export interface MenuSection {
  id: string;
  name: string;
  description: string;
  itemIds: string[]; // assigned menu item ids
  status: 'active' | 'inactive';
  priority: number;
}

interface CategoryState {
  categories: Category[];
  sections: MenuSection[];
  expandedCategoryIds: string[];
  
  // Actions
  createCategory: (cat: Omit<Category, 'id' | 'priority'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;
  
  createSection: (sec: Omit<MenuSection, 'id' | 'priority'>) => void;
  updateSection: (id: string, updates: Partial<MenuSection>) => void;
  assignItemsToSection: (id: string, itemIds: string[]) => void;
  
  toggleCategoryExpand: (id: string) => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────
export const usePortalCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      sections: [],
      expandedCategoryIds: [],

      createCategory: (cat) => {
        const categories = usePortalCategoryStore.getState().categories;
        const maxPriority = categories.reduce((max, c) => Math.max(max, c.priority), 0);
        const id = `cat-${Date.now()}`;
        const newCat: Category = {
          ...cat,
          id,
          priority: maxPriority + 1,
        };
        firestoreService.setDocument(`portal_categories/${id}`, newCat);
      },

      updateCategory: (id, updates) => {
        firestoreService.setDocument(`portal_categories/${id}`, updates);
      },

      deleteCategory: (id) => {
        const categories = usePortalCategoryStore.getState().categories;
        const children = categories.filter((c) => c.parentId === id);
        children.forEach((c) => {
          firestoreService.setDocument(`portal_categories/${c.id}`, { parentId: null });
        });
        firestoreService.deleteDocument(`portal_categories/${id}`);
      },

      reorderCategories: (orderedIds) => {
        orderedIds.forEach((cid, index) => {
          firestoreService.setDocument(`portal_categories/${cid}`, { priority: index + 1 });
        });
      },

      createSection: (sec) => {
        const sections = usePortalCategoryStore.getState().sections;
        const maxPriority = sections.reduce((max, s) => Math.max(max, s.priority), 0);
        const id = `sec-${Date.now()}`;
        const newSec: MenuSection = {
          ...sec,
          id,
          priority: maxPriority + 1,
        };
        firestoreService.setDocument(`portal_sections/${id}`, newSec);
      },

      updateSection: (id, updates) => {
        firestoreService.setDocument(`portal_sections/${id}`, updates);
      },

      assignItemsToSection: (id, itemIds) => {
        firestoreService.setDocument(`portal_sections/${id}`, { itemIds });
      },

      toggleCategoryExpand: (id) => {
        set((state) => {
          const isExpanded = state.expandedCategoryIds.includes(id);
          const expandedCategoryIds = isExpanded
            ? state.expandedCategoryIds.filter((cid) => cid !== id)
            : [...state.expandedCategoryIds, id];
          return { expandedCategoryIds };
        });
      },
    }),
    {
      name: 'feasto-merchant-category-store-v2',
      partialize: (state) => ({
        expandedCategoryIds: state.expandedCategoryIds,
      }),
    }
  )
);

export default usePortalCategoryStore;
