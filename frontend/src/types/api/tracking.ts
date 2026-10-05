export interface LiveTrackingSession {
  sessionId: string;
  orderId: string;
  riderId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    updatedAt: string;
  };
  estimatedEtaMinutes?: number;
  status: 'active' | 'completed' | 'terminated';
}
