// ─── Stage D7 Live Navigation, GPS Tracking & Route Guidance Types ─────────

export type TurnDirection =
  | 'straight'
  | 'turn_left'
  | 'turn_right'
  | 'slight_left'
  | 'slight_right'
  | 'u_turn'
  | 'arrive_destination';

export type GPSStatus = 'high_accuracy' | 'low_accuracy' | 'lost_signal' | 'permission_denied';

export type MapTileMode = 'streets' | 'satellite';

export type NavigationStage =
  | 'nav_to_pickup'
  | 'arrived_pickup'
  | 'nav_to_drop'
  | 'arrived_drop'
  | 'route_completed';

export interface TurnInstruction {
  id: string;
  direction: TurnDirection;
  streetName: string;
  distanceMeters: number;
  landmarkNote?: string;
  isCompleted: boolean;
}

export interface LiveRouteSummary {
  orderId: string;
  orderNumber: string;
  currentStage: NavigationStage;
  totalDistanceKm: number;
  distanceRemainingKm: number;
  estimatedEtaMins: number;
  currentStreetName: string;
  nextInstruction: TurnInstruction;
  gpsSignal: GPSStatus;
  lastSyncTimestamp: string;
  courierLat?: number;
  courierLng?: number;
  restaurantLat?: number;
  restaurantLng?: number;
  customerLat?: number;
  customerLng?: number;
  tileMode?: MapTileMode;
}

export interface NavigationAlertItem {
  id: string;
  type: 'route_deviation' | 'traffic_delay' | 'gps_lost' | 'reroute_suggested';
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
}

export interface SmartAINavigationInsight {
  bestRouteName: string;
  trafficDelayMins: number;
  etaConfidenceScorePct: number;
  rerouteRecommendation: string;
  routeDeviationDetected: boolean;
}
