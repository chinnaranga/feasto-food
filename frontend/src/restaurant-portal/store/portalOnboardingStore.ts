import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingDrafts {
  workspace: {
    workspaceName: string;
    region: string;
    currency: string;
    timezone: string;
  };
  profile: {
    cuisineType: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logoUrl?: string;
    coverUrl?: string;
  };
  business: {
    legalName: string;
    taxId: string;
    registrationNumber: string;
  };
  operations: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
    prepTimeMin: number;
    prepTimeMax: number;
  };
  team: Array<{
    email: string;
    role: string;
  }>;
}

interface OnboardingState {
  currentStepIndex: number;
  completedSteps: string[];
  drafts: OnboardingDrafts;
  
  setStepIndex: (index: number) => void;
  setStepDraft: <K extends keyof OnboardingDrafts>(step: K, data: OnboardingDrafts[K]) => void;
  markStepComplete: (stepKey: string) => void;
  resetOnboarding: () => void;
}

const initialDrafts: OnboardingDrafts = {
  workspace: {
    workspaceName: '',
    region: 'United States',
    currency: 'USD',
    timezone: 'America/New_York',
  },
  profile: {
    cuisineType: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  },
  business: {
    legalName: '',
    taxId: '',
    registrationNumber: '',
  },
  operations: {
    dineIn: true,
    takeaway: true,
    delivery: true,
    prepTimeMin: 15,
    prepTimeMax: 30,
  },
  team: [],
};

export const usePortalOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStepIndex: 0,
      completedSteps: [],
      drafts: initialDrafts,

      setStepIndex: (currentStepIndex) => set({ currentStepIndex }),
      setStepDraft: (step, data) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [step]: data,
          },
        })),
      markStepComplete: (stepKey) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(stepKey)
            ? state.completedSteps
            : [...state.completedSteps, stepKey],
        })),
      resetOnboarding: () =>
        set({
          currentStepIndex: 0,
          completedSteps: [],
          drafts: initialDrafts,
        }),
    }),
    {
      name: 'feasto-restaurant-portal-onboarding',
      partialize: (state) => ({
        currentStepIndex: state.currentStepIndex,
        completedSteps: state.completedSteps,
        drafts: state.drafts,
      }),
    }
  )
);
export default usePortalOnboardingStore;
