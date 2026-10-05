import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AnalyticsFilterState {
  dateRangePreset: 'today' | '7d' | '30d' | 'custom';
  customDateRange: DateRange;
  branch: 'all' | 'Downtown Flagship' | 'Suburbs Cloud Kitchen';
  segment: 'all' | 'dine-in' | 'delivery' | 'takeaway';
  comparisonMode: boolean;
  
  // Actions
  setDateRangePreset: (preset: 'today' | '7d' | '30d' | 'custom') => void;
  setCustomDateRange: (range: DateRange) => void;
  setBranch: (branch: 'all' | 'Downtown Flagship' | 'Suburbs Cloud Kitchen') => void;
  setSegment: (segment: 'all' | 'dine-in' | 'delivery' | 'takeaway') => void;
  toggleComparisonMode: () => void;
  resetFilters: () => void;
}

// ─── Analytics Zustand Store ──────────────────────────────────────────────────
export const usePortalAnalyticsStore = create<AnalyticsFilterState>()(
  persist(
    (set) => ({
      dateRangePreset: '7d',
      customDateRange: {
        startDate: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
      branch: 'all',
      segment: 'all',
      comparisonMode: false,

      setDateRangePreset: (preset) => set({ dateRangePreset: preset }),

      setCustomDateRange: (range) => set({ customDateRange: range, dateRangePreset: 'custom' }),

      setBranch: (branch) => set({ branch }),

      setSegment: (segment) => set({ segment }),

      toggleComparisonMode: () => set((state) => ({ comparisonMode: !state.comparisonMode })),

      resetFilters: () => set({
        dateRangePreset: '7d',
        customDateRange: {
          startDate: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
        branch: 'all',
        segment: 'all',
        comparisonMode: false,
      }),
    }),
    {
      name: 'feasto-merchant-analytics-store',
    }
  )
);

export default usePortalAnalyticsStore;
