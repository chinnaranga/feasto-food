// ─── Stage D5 Order Discovery & Assignment Types ──────────────────────────────

export type PriorityLevel = 'high_surge' | 'standard' | 'scheduled';

export type OfferStatus = 'available' | 'accepted' | 'declined' | 'expired' | 'in_transit';

export type DeliveryType = 'food_delivery' | 'pickup_handoff' | 'priority_express' | 'scheduled_catering';

export interface DeliveryOfferItem {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  dropoffAddress: string;
  customerPhone: string;

  totalDistanceKm: number;
  estimatedTimeMins: number;
  payoutAmount: number;
  tipAmount: number;
  surgeBonusAmount: number;

  itemCount: number;
  itemsList: string[];
  pickupReadiness: 'ready_now' | 'preparing_5m' | 'preparing_10m';
  deliveryType: DeliveryType;

  specialInstructions?: string;
  expirySeconds: number;
  priorityLevel: PriorityLevel;
  status: OfferStatus;

  zoneName: string;
  pickupSla: string;
}

export type OrderSortOption = 'payout_high' | 'distance_short' | 'expiry_urgent' | 'priority';

export interface OrderFilterCriteria {
  zone: string;
  deliveryType: 'all' | DeliveryType;
  priorityOnly: boolean;
  minPayout: number;
}

export type DeclineReason =
  | 'distance_too_far'
  | 'payout_too_low'
  | 'vehicle_unsuitable'
  | 'taking_break'
  | 'other';

export interface SmartAIOrderMatch {
  matchScorePct: number;
  earningsOptimizationBonus: number;
  routeCompatibilityScore: number;
  acceptanceLikelihoodPct: number;
}
