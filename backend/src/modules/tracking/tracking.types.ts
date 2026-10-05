import { TrackingSessionStatus } from './tracking.model.js';
import { GeofenceType, GeofenceEventType } from './models/geofenceEvent.model.js';

export interface CreateTrackingSessionDTO {
  orderId: string;
  riderId: string;
  restaurantId: string;
  branchId: string;
  customerId: string;
}

export interface PushLocationDTO {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export interface UpdateRouteDTO {
  waypoints: Array<{ latitude: number; longitude: number }>;
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
}

export interface GeofenceEventDTO {
  geofenceType: GeofenceType;
  eventType: GeofenceEventType;
}

export interface UpdateEtaDTO {
  etaMinutes: number;
  distanceRemainingKm: number;
}

export interface OrderTrackingViewResponse {
  sessionId: string;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  deliveryStatus: string;
  riderInfo?: {
    riderId: string;
    fullName: string;
    phone: string;
    profilePhoto?: string;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    updatedAt: Date;
  };
  etaMinutes: number;
  distanceRemainingKm: number;
  trackingStatus: TrackingSessionStatus;
  updatedAt: Date;
}
