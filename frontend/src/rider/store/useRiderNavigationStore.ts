import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TurnInstruction,
  GPSStatus,
  MapTileMode,
  NavigationStage,
  LiveRouteSummary,
  NavigationAlertItem,
  SmartAINavigationInsight,
} from '../types/navigation';
import { fetchOSRMRoute, startGPSWatch, stopGPSWatch, GPSLocationData } from '../services/riderNavigationServices';

interface RiderNavigationState {
  routeSummary: LiveRouteSummary;
  instructions: TurnInstruction[];
  currentInstructionIndex: number;
  routePolylineCoords: [number, number][];
  alerts: NavigationAlertItem[];
  aiInsight: SmartAINavigationInsight;
  isMapRecenter: boolean;
  gpsWatchId: number | null;
  tileMode: MapTileMode;

  // Actions
  setGpsStatus: (status: GPSStatus) => void;
  setTileMode: (mode: MapTileMode) => void;
  toggleTileMode: () => void;
  updateLocationData: (data: GPSLocationData) => void;
  loadRealOSRMRoute: (startLat: number, startLng: number, endLat: number, endLng: number) => Promise<void>;

  advanceInstruction: () => void;
  triggerReroute: () => void;
  recenterMap: () => void;
  dismissAlert: (alertId: string) => void;

  startLiveGPS: () => void;
  stopLiveGPS: () => void;
}

const BANDRA_RESTAURANT_LAT = 19.0596;
const BANDRA_RESTAURANT_LNG = 72.8295;
const KHAR_CUSTOMER_LAT = 19.0700;
const KHAR_CUSTOMER_LNG = 72.8340;

const INITIAL_INSTRUCTIONS: TurnInstruction[] = [
  {
    id: 'inst-1',
    direction: 'straight',
    streetName: 'Waterfield Road, Bandra West',
    distanceMeters: 400,
    landmarkNote: 'Pass National College on your left',
    isCompleted: true,
  },
  {
    id: 'inst-2',
    direction: 'turn_right',
    streetName: 'Linking Road Interchange',
    distanceMeters: 200,
    landmarkNote: 'Turn right at the Honda Showroom junction',
    isCompleted: false,
  },
  {
    id: 'inst-3',
    direction: 'turn_left',
    streetName: 'Perry Cross Road',
    distanceMeters: 600,
    landmarkNote: 'Turn left into Perry Cross residential lane',
    isCompleted: false,
  },
  {
    id: 'inst-4',
    direction: 'arrive_destination',
    streetName: 'Flat 902, Perry Cross Road',
    distanceMeters: 50,
    landmarkNote: 'Destination will be on the right side',
    isCompleted: false,
  },
];

const INITIAL_ROUTE_SUMMARY: LiveRouteSummary = {
  orderId: 'off-101',
  orderNumber: '#1809',
  currentStage: 'nav_to_drop',
  totalDistanceKm: 3.4,
  distanceRemainingKm: 1.2,
  estimatedEtaMins: 8,
  currentStreetName: 'Waterfield Road',
  nextInstruction: INITIAL_INSTRUCTIONS[1],
  gpsSignal: 'high_accuracy',
  lastSyncTimestamp: 'Just now',
  courierLat: BANDRA_RESTAURANT_LAT,
  courierLng: BANDRA_RESTAURANT_LNG,
  restaurantLat: BANDRA_RESTAURANT_LAT,
  restaurantLng: BANDRA_RESTAURANT_LNG,
  customerLat: KHAR_CUSTOMER_LAT,
  customerLng: KHAR_CUSTOMER_LNG,
  tileMode: 'streets',
};

const INITIAL_ALERTS: NavigationAlertItem[] = [
  {
    id: 'nav_alt_1',
    type: 'traffic_delay',
    title: '⚡ Heavy Traffic Delay on Linking Road',
    message: '+4 mins expected due to evening peak hour congestion. AI suggested alternative via Turner Road.',
    timestamp: '2 mins ago',
    actionLabel: 'Accept Reroute',
  },
];

const INITIAL_AI_INSIGHT: SmartAINavigationInsight = {
  bestRouteName: 'Turner Road Bypass (Save 3 mins)',
  trafficDelayMins: 4,
  etaConfidenceScorePct: 96,
  rerouteRecommendation: 'Take Turner Road left turn to avoid Linking Road traffic junction.',
  routeDeviationDetected: false,
};

export const useRiderNavigationStore = create<RiderNavigationState>()(
  persist(
    (set, get) => ({
      routeSummary: INITIAL_ROUTE_SUMMARY,
      instructions: INITIAL_INSTRUCTIONS,
      currentInstructionIndex: 1,
      routePolylineCoords: [
        [BANDRA_RESTAURANT_LAT, BANDRA_RESTAURANT_LNG],
        [19.0640, 72.8310],
        [KHAR_CUSTOMER_LAT, KHAR_CUSTOMER_LNG],
      ],
      alerts: INITIAL_ALERTS,
      aiInsight: INITIAL_AI_INSIGHT,
      isMapRecenter: true,
      gpsWatchId: null,
      tileMode: 'streets',

      setGpsStatus: (gpsSignal) =>
        set((state) => ({
          routeSummary: { ...state.routeSummary, gpsSignal },
        })),

      setTileMode: (tileMode) =>
        set((state) => ({
          tileMode,
          routeSummary: { ...state.routeSummary, tileMode },
        })),

      toggleTileMode: () =>
        set((state) => {
          const nextMode: MapTileMode = state.tileMode === 'streets' ? 'satellite' : 'streets';
          return {
            tileMode: nextMode,
            routeSummary: { ...state.routeSummary, tileMode: nextMode },
          };
        }),

      updateLocationData: (data: GPSLocationData) =>
        set((state) => ({
          routeSummary: {
            ...state.routeSummary,
            courierLat: data.latitude,
            courierLng: data.longitude,
            gpsSignal: data.accuracyMeters < 15 ? 'high_accuracy' : 'low_accuracy',
            lastSyncTimestamp: 'Just now',
          },
        })),

      loadRealOSRMRoute: async (startLat, startLng, endLat, endLng) => {
        const res = await fetchOSRMRoute(startLat, startLng, endLat, endLng);
        set((state) => ({
          routePolylineCoords: res.coordinates,
          instructions: res.instructions.length > 0 ? res.instructions : state.instructions,
          routeSummary: {
            ...state.routeSummary,
            totalDistanceKm: res.distanceKm,
            distanceRemainingKm: res.distanceKm,
            estimatedEtaMins: res.durationMins,
          },
        }));
      },

      advanceInstruction: () =>
        set((state) => {
          const nextIdx = state.currentInstructionIndex + 1;
          if (nextIdx < state.instructions.length) {
            return {
              currentInstructionIndex: nextIdx,
              routeSummary: {
                ...state.routeSummary,
                nextInstruction: state.instructions[nextIdx],
                distanceRemainingKm: Math.max(0.1, state.routeSummary.distanceRemainingKm - 0.4),
                estimatedEtaMins: Math.max(1, state.routeSummary.estimatedEtaMins - 2),
              },
            };
          }
          return state;
        }),

      triggerReroute: () =>
        set((state) => ({
          routeSummary: {
            ...state.routeSummary,
            currentStreetName: 'Turner Road Bypass',
            estimatedEtaMins: Math.max(2, state.routeSummary.estimatedEtaMins - 3),
          },
          alerts: state.alerts.filter((a) => a.type !== 'traffic_delay'),
        })),

      recenterMap: () => set({ isMapRecenter: true }),

      dismissAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        })),

      startLiveGPS: () => {
        const existingWatch = get().gpsWatchId;
        if (existingWatch !== null) return;

        const watchId = startGPSWatch(
          (data) => {
            get().updateLocationData(data);
          },
          (err) => {
            get().setGpsStatus('lost_signal');
          }
        );

        set({ gpsWatchId: watchId });
      },

      stopLiveGPS: () => {
        const watchId = get().gpsWatchId;
        if (watchId !== null) {
          stopGPSWatch(watchId);
          set({ gpsWatchId: null });
        }
      },
    }),
    {
      name: 'feasto-rider-navigation-store-d7',
    }
  )
);

export default useRiderNavigationStore;
