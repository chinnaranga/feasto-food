import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BranchProfile,
  DayHours,
  SpecialClosure,
  BranchStaffAssignment,
  DeliveryZone,
  BranchPerformanceMetric,
  BranchReadinessScore,
  RegionalConfig,
  SmartAIBranchInsight,
} from '../../types/branches';
import { restaurantRepository } from '../../repositories/restaurant/restaurantRepository';

interface PortalBranchesState {
  branches: BranchProfile[];
  selectedBranchId: string | 'all';
  branchHours: Record<string, DayHours[]>;
  specialClosures: Record<string, SpecialClosure[]>;
  staffAssignments: BranchStaffAssignment[];
  deliveryZones: DeliveryZone[];
  performanceMetrics: BranchPerformanceMetric[];
  readinessScores: Record<string, BranchReadinessScore>;
  regions: RegionalConfig[];
  aiInsights: SmartAIBranchInsight[];

  // Search & Filter
  searchQuery: string;
  regionFilter: string;
  statusFilter: string;

  // Actions
  setSelectedBranchId: (id: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  setRegionFilter: (region: string) => void;
  setStatusFilter: (status: string) => void;

  // Branch CRUD
  addBranch: (branchData: Omit<BranchProfile, 'id' | 'code' | 'openedDate'>) => void;
  updateBranchProfile: (id: string, branchData: Partial<BranchProfile>) => void;
  toggleBranchStatus: (id: string) => void;
  deleteBranch: (id: string) => void;

  // Realtime subscriber
  subscribePortalBranches: (restaurantId: string) => () => void;
}

export const usePortalBranchesStore = create<PortalBranchesState>()(
  persist(
    (set, get) => ({
      branches: [],
      selectedBranchId: 'all',
      branchHours: {},
      specialClosures: {},
      staffAssignments: [],
      deliveryZones: [],
      performanceMetrics: [],
      readinessScores: {},
      regions: [],
      aiInsights: [],

      searchQuery: '',
      regionFilter: 'all',
      statusFilter: 'all',

      setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setRegionFilter: (regionFilter) => set({ regionFilter }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      addBranch: (branchData) =>
        set((state) => {
          const newId = `br-${Date.now()}`;
          const newBranch: BranchProfile = {
            ...branchData,
            id: newId,
            code: `BR-${Math.floor(100 + Math.random() * 900)}`,
            openedDate: new Date().toISOString().split('T')[0],
          };
          return { branches: [...state.branches, newBranch] };
        }),

      updateBranchProfile: (id, branchData) =>
        set((state) => ({
          branches: state.branches.map((b) => (b.id === id ? { ...b, ...branchData } : b)),
        })),

      toggleBranchStatus: (id) =>
        set((state) => ({
          branches: state.branches.map((b) =>
            b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
          ),
        })),

      deleteBranch: (id) =>
        set((state) => ({
          branches: state.branches.filter((b) => b.id !== id),
        })),

      subscribePortalBranches: (restaurantId: string) => {
        return restaurantRepository.subscribePortalBranches(restaurantId, (branches) => {
          set({ branches });
        });
      },
    }),
    {
      name: 'feasto-portal-branches-store',
    }
  )
);

export default usePortalBranchesStore;
