// ─── Stage D1 Rider App Foundation Types ─────────────────────────────────────

export type RiderAvailability = 'online' | 'offline' | 'on_delivery' | 'paused';

export type VehicleType = 'motorbike' | 'scooter_ev' | 'bicycle' | 'car';

export type DeliveryStep =
  | 'idle'
  | 'assigned'
  | 'navigating_to_store'
  | 'arrived_at_store'
  | 'picked_up'
  | 'navigating_to_diner'
  | 'arrived_at_diner'
  | 'delivered';

export interface RiderProfile {
  id: string;
  riderCode: string; // e.g. RDR-8802
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  rating: number;
  totalCompletedDeliveries: number;
  acceptanceRatePct: number;
  completionRatePct: number;
  joinedDate: string;
  walletBalance: number;
  pendingPayout: number;
  vehicleType: VehicleType;
  vehiclePlateNumber: string;
  vehicleModel: string;
  currentZone: string;
  availability: RiderAvailability;
}

export interface DeliveryOffer {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerPhone: string;
  dropoffAddress: string;
  deliveryAddress?: string;
  pickupDistanceKm: number;
  dropoffDistanceKm: number;
  estimatedTimeMins: number;
  totalDistanceKm: number;
  payoutAmount: number;
  tipAmount: number;
  itemCount: number;
  pickupSla: string;
  expiresInSeconds: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

export interface RiderEarningsSummary {
  todayEarnings: number;
  todayTrips: number;
  todayOnlineMinutes: number;
  todayTips: number;
  todayIncentives: number;
  weeklyEarnings: number;
  weeklyTrips: number;
}

export interface RiderVehicleInfo {
  type: VehicleType;
  makeModel: string;
  plateNumber: string;
  color: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  registrationExpiry: string;
  insuranceExpiry: string;
}

export interface RiderDocumentItem {
  id: string;
  title: string;
  documentType: 'driving_license' | 'aadhaar' | 'vehicle_rc' | 'insurance' | 'bg_check';
  status: 'verified' | 'pending' | 'action_required' | 'expired';
  expiryDate?: string;
  lastUpdated?: string;
}

export interface RiderNavItem {
  id: string;
  label: string;
  route: string;
  iconName: string;
  badgeCount?: number;
}

export default RiderProfile;
