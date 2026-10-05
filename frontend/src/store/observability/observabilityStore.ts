import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiagnosticEvent, ClientHealthStats } from '../../types/observability';
import { MAX_EVENT_LOGS, MAX_ACTION_STACK, DIAGNOSTIC_LOGS_KEY } from '../../constants/observability';
import { calculateHealthMetrics } from '../../services/observability/healthRules';

interface ObservabilityState extends ClientHealthStats {
  telemetryConsent: boolean;
  events: DiagnosticEvent[];
  lastActions: string[];
  bannerVisible: boolean;
  bannerMessage: string | null;
  
  addEvent: (event: DiagnosticEvent) => void;
  addAction: (action: string) => void;
  clearLogs: () => void;
  setTelemetryConsent: (consent: boolean) => void;
  setBannerVisible: (visible: boolean, message?: string | null) => void;
  updateNetworkStatus: (online: boolean) => void;
}

export const useObservabilityStore = create<ObservabilityState>()(
  persist(
    (set, get) => ({
      // initial state
      errorCount: 0,
      warningCount: 0,
      healthScore: 100,
      status: 'optimal',
      routeHealth: {},
      telemetryConsent: true, // opt-out default, users can opt-out in settings
      events: [],
      lastActions: [],
      bannerVisible: false,
      bannerMessage: null,

      addEvent: (event) => {
        const { events, telemetryConsent } = get();
        if (!telemetryConsent && event.severity !== 'fatal') {
          // If no consent, discard everything except fatal crashes (which we need for crash recovery)
          return;
        }

        const updatedEvents = [event, ...events].slice(0, MAX_EVENT_LOGS);
        
        // Re-evaluate health stats
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
        const healthStats = calculateHealthMetrics(updatedEvents, isOnline);

        set({
          events: updatedEvents,
          ...healthStats,
        });

        // Trigger incident banner automatically for fatal events
        if (event.severity === 'fatal') {
          set({
            bannerVisible: true,
            bannerMessage: event.message,
          });
        }
      },

      addAction: (action) => {
        const { lastActions } = get();
        const cleanedAction = action.trim();
        if (!cleanedAction) return;

        set({
          lastActions: [cleanedAction, ...lastActions].slice(0, MAX_ACTION_STACK),
        });
      },

      clearLogs: () => {
        set({
          events: [],
          errorCount: 0,
          warningCount: 0,
          healthScore: 100,
          status: 'optimal',
          routeHealth: {},
        });
      },

      setTelemetryConsent: (telemetryConsent) => set({ telemetryConsent }),

      setBannerVisible: (bannerVisible, bannerMessage = null) => 
        set({ bannerVisible, bannerMessage }),

      updateNetworkStatus: (online) => {
        const { events } = get();
        const healthStats = calculateHealthMetrics(events, online);
        set({ ...healthStats });
      },
    }),
    {
      name: DIAGNOSTIC_LOGS_KEY,
      partialize: (state) => ({
        telemetryConsent: state.telemetryConsent,
        events: state.events,
        lastActions: state.lastActions,
      }),
    }
  )
);
