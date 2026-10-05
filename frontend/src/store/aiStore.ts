import { create } from 'zustand';

interface AIRecommendation {
  dishId: string;
  dishName: string;
  matchPercentage: number;
  reasoning: string;
}

interface AIState {
  currentRecommendationQuery: string | null;
  activeRecommendations: AIRecommendation[];
  isSearching: boolean;
  setQuery: (query: string | null) => void;
  setRecommendations: (recommendations: AIRecommendation[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  resetAI: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  currentRecommendationQuery: null,
  activeRecommendations: [],
  isSearching: false,
  setQuery: (currentRecommendationQuery) => set({ currentRecommendationQuery }),
  setRecommendations: (activeRecommendations) => set({ activeRecommendations }),
  setIsSearching: (isSearching) => set({ isSearching }),
  resetAI: () => set({ currentRecommendationQuery: null, activeRecommendations: [], isSearching: false }),
}));
