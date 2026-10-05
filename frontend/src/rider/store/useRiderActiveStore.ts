import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DeliveryStage,
  ActiveDeliveryTask,
  DeliveryException,
  SmartAIActiveInsight,
} from '../types/active';
import { riderRepository } from '../../repositories/rider/riderRepository';

interface RiderActiveState {
  activeTask: ActiveDeliveryTask | null;
  exceptions: DeliveryException[];
  aiInsight: SmartAIActiveInsight;
  isReportIssueModalOpen: boolean;

  // Actions
  setActiveTask: (task: ActiveDeliveryTask | null) => void;
  advanceStage: () => void;
  toggleChecklistItem: (itemId: string) => void;

  reportException: (type: DeliveryException['type'], notes: string) => void;
  completeActiveTask: () => void;
  setReportIssueModalOpen: (isOpen: boolean) => void;
  subscribeLiveTask: (riderId: string) => () => void;
}

const INITIAL_AI_INSIGHT: SmartAIActiveInsight = {
  pickupEtaPredictionMins: 0,
  deliveryEtaPredictionMins: 0,
  delayRiskLevel: 'low',
  routeEfficiencyTip: 'Live GPS route active. Follow turn-by-turn guidance.',
};

export const useRiderActiveStore = create<RiderActiveState>()(
  persist(
    (set, get) => ({
      activeTask: null,
      exceptions: [],
      aiInsight: INITIAL_AI_INSIGHT,
      isReportIssueModalOpen: false,

      setActiveTask: (activeTask) => set({ activeTask }),

      advanceStage: () =>
        set((state) => {
          if (!state.activeTask) return state;

          const stageSequence: DeliveryStage[] = [
            'accepted',
            'en_route_to_pickup',
            'arrived_at_pickup',
            'picked_up',
            'en_route_to_drop',
            'arrived_at_drop',
            'delivered',
          ];

          const currentIndex = stageSequence.indexOf(state.activeTask.currentStage);
          if (currentIndex >= 0 && currentIndex < stageSequence.length - 1) {
            const nextStage = stageSequence[currentIndex + 1];
            return {
              activeTask: {
                ...state.activeTask,
                currentStage: nextStage,
                distanceRemainingKm: Math.max(0, state.activeTask.distanceRemainingKm - 0.6),
              },
            };
          }

          return state;
        }),

      toggleChecklistItem: (itemId) =>
        set((state) => {
          if (!state.activeTask) return state;
          return {
            activeTask: {
              ...state.activeTask,
              itemsList: state.activeTask.itemsList.map((item) =>
                item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
              ),
            },
          };
        }),

      reportException: (type, notes) =>
        set((state) => ({
          exceptions: [
            ...state.exceptions,
            {
              id: `exc_${Date.now()}`,
              type,
              title: type.replace('_', ' ').toUpperCase(),
              notes,
              timestamp: 'Just now',
              status: 'pending',
            },
          ],
          isReportIssueModalOpen: false,
        })),

      completeActiveTask: () => set({ activeTask: null }),

      setReportIssueModalOpen: (isReportIssueModalOpen) => set({ isReportIssueModalOpen }),

      subscribeLiveTask: (riderId: string) => {
        return riderRepository.subscribeActiveDeliveryTask(riderId, (task) => {
          set({ activeTask: task });
        });
      },
    }),
    {
      name: 'feasto-rider-active-store-d6',
    }
  )
);

export default useRiderActiveStore;
