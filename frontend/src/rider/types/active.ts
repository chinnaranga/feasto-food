// ─── Stage D6 Active Delivery, Pickup Workflow & Route Execution Types ───────

export type DeliveryStage =
  | 'accepted'
  | 'en_route_to_pickup'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'en_route_to_drop'
  | 'arrived_at_drop'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface PickupChecklistItem {
  id: string;
  itemName: string;
  quantity: number;
  isChecked: boolean;
}

export interface ActiveDeliveryTask {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName: string;
  dropoffAddress: string;
  customerPhone: string;

  itemCount: number;
  itemsList: PickupChecklistItem[];
  specialInstructions?: string;

  totalDistanceKm: number;
  distanceRemainingKm: number;
  estimatedEtaMins: number;

  currentStage: DeliveryStage;
  priorityLevel: 'high_surge' | 'standard' | 'scheduled';
  payoutAmount: number;
  tipAmount: number;
  surgeBonusAmount: number;

  pickupSlaTime: string;
  deliverySlaTime: string;
}

export interface DeliveryException {
  id: string;
  type: 'restaurant_delay' | 'customer_unavailable' | 'address_issue' | 'item_issue' | 'vehicle_breakdown';
  title: string;
  notes: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface SmartAIActiveInsight {
  pickupEtaPredictionMins: number;
  deliveryEtaPredictionMins: number;
  delayRiskLevel: 'low' | 'medium' | 'high';
  routeEfficiencyTip: string;
}
