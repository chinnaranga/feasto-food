import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface CRMNote {
  id: string;
  type: 'preference' | 'allergy' | 'complaint' | 'staff' | 'visit';
  author: string;
  content: string;
  timestamp: string;
}

export interface CustomerConsent {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface CustomerOutreach {
  preferredWindow: string; // e.g. "18:00 - 20:00"
  timezone: string; // e.g. "IST", "EST"
  language: string; // e.g. "English", "Hindi"
  nextRemindSuggestion?: string; // Optional AI recommendation
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredBranch: string;
  preferredCuisine: string;
  favoriteItems: string[];
  averageSpend: number;
  visitFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Rarely';
  lastVisit: string; // YYYY-MM-DD
  loyaltyStatus: 'VIP' | 'Regular' | 'New' | 'Dormant';
  joinDate: string; // YYYY-MM-DD
  riskScore: number; // 0 to 100
  engagementScore: number; // 0 to 100
  lifetimeValue: number;
  tags: string[];
  notes: CRMNote[];
  consent: CustomerConsent;
  outreach: CustomerOutreach;
  isArchived?: boolean;
  followUpFlag?: boolean;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  rulesCount: number;
  customerCount: number;
  isCustom?: boolean;
}

interface CustomerState {
  customers: Customer[];
  segments: CustomerSegment[];
  selectedCustomerIds: string[];
  activeTab: 'directory' | 'segments' | 'retention' | 'notes' | 'outreach';
  filters: {
    searchQuery: string;
    branch: string;
    loyaltyStatus: string;
    visitFrequency: string;
    riskAlert: string;
    spendBracket: string;
    consentFilter: string;
  };

  // Tab control
  setActiveTab: (tab: CustomerState['activeTab']) => void;
  setSearchQuery: (q: string) => void;
  setFilter: (key: keyof CustomerState['filters'], value: string) => void;
  clearFilters: () => void;

  setSelectedCustomerIds: (ids: string[]) => void;
  toggleSelectCustomer: (id: string) => void;

  createCustomer: (c: Omit<Customer, 'id' | 'joinDate' | 'riskScore' | 'engagementScore' | 'lifetimeValue' | 'notes'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  archiveCustomer: (id: string) => void;
  toggleFollowUp: (id: string) => void;
  addCustomerNote: (customerId: string, note: Omit<CRMNote, 'id' | 'timestamp'>) => void;

  createSegment: (segment: Omit<CustomerSegment, 'id' | 'customerCount' | 'isCustom'>) => void;
  deleteSegment: (id: string) => void;
}

// ─── Customer Zustand Store ──────────────────────────────────────────────────
export const usePortalCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: [],
      segments: [],
      selectedCustomerIds: [],
      activeTab: 'directory',
      filters: {
        searchQuery: '',
        branch: 'all',
        loyaltyStatus: 'all',
        visitFrequency: 'all',
        riskAlert: 'all',
        spendBracket: 'all',
        consentFilter: 'all',
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSearchQuery: (q) => set((state) => ({ filters: { ...state.filters, searchQuery: q } })),

      setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

      clearFilters: () => set({
        filters: {
          searchQuery: '',
          branch: 'all',
          loyaltyStatus: 'all',
          visitFrequency: 'all',
          riskAlert: 'all',
          spendBracket: 'all',
          consentFilter: 'all',
        }
      }),

      setSelectedCustomerIds: (ids) => set({ selectedCustomerIds: ids }),

      toggleSelectCustomer: (id) => set((state) => {
        const isSelected = state.selectedCustomerIds.includes(id);
        const selected = isSelected
          ? state.selectedCustomerIds.filter((cid) => cid !== id)
          : [...state.selectedCustomerIds, id];
        return { selectedCustomerIds: selected };
      }),

      createCustomer: (c) => {
        const id = `cust-${Math.random().toString(36).substr(2, 9)}`;
        const newCustomer: Customer = {
          ...c,
          id,
          joinDate: new Date().toISOString().split('T')[0],
          riskScore: 25,
          engagementScore: 50,
          lifetimeValue: 0,
          notes: [],
        };
        firestoreService.setDocument(`portal_customers/${id}`, newCustomer);
      },

      updateCustomer: (id, updates) => {
        firestoreService.setDocument(`portal_customers/${id}`, updates);
      },

      archiveCustomer: (id) => {
        firestoreService.setDocument(`portal_customers/${id}`, { isArchived: true });
      },

      toggleFollowUp: (id) => {
        const match = get().customers.find((c) => c.id === id);
        if (match) {
          firestoreService.setDocument(`portal_customers/${id}`, { followUpFlag: !match.followUpFlag });
        }
      },

      addCustomerNote: (customerId, note) => {
        const match = get().customers.find((c) => c.id === customerId);
        if (match) {
          const newNote: CRMNote = {
            ...note,
            id: `n-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
          firestoreService.setDocument(`portal_customers/${customerId}`, {
            notes: [newNote, ...match.notes],
          });
        }
      },

      createSegment: (segment) => {
        const id = `seg-${Math.random().toString(36).substr(2, 9)}`;
        const newSeg: CustomerSegment = {
          ...segment,
          id,
          customerCount: 0,
          isCustom: true,
        };
        firestoreService.setDocument(`portal_segments/${id}`, newSeg);
      },

      deleteSegment: (id) => {
        firestoreService.deleteDocument(`portal_segments/${id}`);
      }
    }),
    {
      name: 'feasto-portal-crm-storage-v2',
      partialize: (state) => ({
        activeTab: state.activeTab,
      }),
    }
  )
);

export default usePortalCustomerStore;
