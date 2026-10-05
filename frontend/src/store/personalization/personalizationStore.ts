import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TasteProfile } from '@/types/personalization';

interface PersonalizationState {
  explicitPreferences: TasteProfile;
  inferredCuisineAffinities: Record<string, number>;
  dismissedRecommendationIds: string[];
  lastOrderedCuisines: string[];
  averageOrderValue: number;
  recommendationLoading: boolean;

  // Actions
  updateExplicitPreferences: (prefs: Partial<TasteProfile>) => void;
  recordCuisineClick: (cuisine: string) => void;
  recordOrderPlaced: (restaurantId: string, cuisines: string[], total: number) => void;
  dismissRecommendation: (id: string) => void;
  resetPreferences: () => void;
  setRecommendationLoading: (loading: boolean) => void;
}

const DEFAULT_EXPLICIT: TasteProfile = {
  spiceTolerance: 'any',
  preferredTimeOfDay: 'any',
  pricePreference: 'any',
  strictDietary: false,
};

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set) => ({
      explicitPreferences: DEFAULT_EXPLICIT,
      inferredCuisineAffinities: {},
      dismissedRecommendationIds: [],
      lastOrderedCuisines: [],
      averageOrderValue: 0,
      recommendationLoading: false,

      updateExplicitPreferences: (prefs) =>
        set((state) => ({
          explicitPreferences: { ...state.explicitPreferences, ...prefs },
        })),

      recordCuisineClick: (cuisine) =>
        set((state) => {
          const currentScore = state.inferredCuisineAffinities[cuisine] || 0;
          const newScore = Math.min(100, currentScore + 5);
          return {
            inferredCuisineAffinities: {
              ...state.inferredCuisineAffinities,
              [cuisine]: newScore,
            },
          };
        }),

      recordOrderPlaced: (_restaurantId, cuisines, total) =>
        set((state) => {
          // Boost cuisine affinities
          const updatedAffinities = { ...state.inferredCuisineAffinities };
          cuisines.forEach((c) => {
            const current = updatedAffinities[c] || 0;
            updatedAffinities[c] = Math.min(100, current + 20);
          });

          // Calculate running average for Order Value
          const prevAOV = state.averageOrderValue;
          const newAOV = prevAOV === 0 ? total : parseFloat((prevAOV * 0.7 + total * 0.3).toFixed(2));

          // Last ordered cuisines (keep unique top 5)
          const updatedLastOrdered = Array.from(new Set([...cuisines, ...state.lastOrderedCuisines])).slice(0, 5);

          return {
            inferredCuisineAffinities: updatedAffinities,
            averageOrderValue: newAOV,
            lastOrderedCuisines: updatedLastOrdered,
          };
        }),

      dismissRecommendation: (id) =>
        set((state) => ({
          dismissedRecommendationIds: [...state.dismissedRecommendationIds, id],
        })),

      resetPreferences: () =>
        set({
          explicitPreferences: DEFAULT_EXPLICIT,
          inferredCuisineAffinities: {},
          dismissedRecommendationIds: [],
          lastOrderedCuisines: [],
          averageOrderValue: 0,
        }),

      setRecommendationLoading: (loading) => set({ recommendationLoading: loading }),
    }),
    { name: 'feasto-personalization-profile' }
  )
);

export default usePersonalizationStore;
