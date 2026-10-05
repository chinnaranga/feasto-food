// ─── Stage R22 Multi-Branch Management & Regional Control Types ─────────────

export type BranchStatus = 'active' | 'inactive' | 'review_needed' | 'launching' | 'maintenance';

export type OperationalStatus = 'open' | 'closed' | 'busy' | 'kitchen_paused' | 'emergency_closed';

export interface DayHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  storeOpen: string;
  storeClose: string;
  kitchenOpen: string;
  kitchenClose: string;
  deliveryOpen: string;
  deliveryClose: string;
}

export interface SpecialClosure {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  reason: 'holiday' | 'renovation' | 'staff_training' | 'weather' | 'emergency';
  affectsDelivery: boolean;
  affectsPickup: boolean;
}

export interface BranchProfile {
  id: string;
  code: string; // e.g. BR-MUM-01
  name: string;
  region: string; // e.g. Maharashtra West
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  managerEmail: string;
  timezone: string;
  currency: string;
  status: BranchStatus;
  operationalStatus: OperationalStatus;
  openedDate: string;
  seatingCapacity: number;
  hasKitchenDisplay: boolean;
  hasDeliveryDispatch: boolean;
  hasSelfOrderingKiosk: boolean;
}

export interface BranchStaffAssignment {
  staffId: string;
  staffName: string;
  role: 'head_chef' | 'branch_manager' | 'cashier' | 'kitchen_line' | 'runner';
  branchId: string;
  isPrimaryBranch: boolean;
  shiftSchedule: string;
}

export interface BranchMenuScope {
  branchId: string;
  availableCategoryIds: string[];
  disabledDishIds: string[];
  customPriceAdjustmentsPct: number; // e.g. +5% for premium airport branch
}

export interface DeliveryZone {
  id: string;
  branchId: string;
  name: string; // e.g. Bandra West & Pali Hill Zone
  radiusKm: number;
  serviceablePinCodes: string[];
  status: 'active' | 'paused' | 'over_capacity';
  minOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryMins: number;
}

export interface BranchPerformanceMetric {
  branchId: string;
  branchName: string;
  dailyRevenue: number;
  dailyOrders: number;
  avgOrderValue: number;
  fulfillmentSpeedMins: number;
  customerRating: number;
  staffCoveragePct: number;
  inventoryHealthPct: number;
  rank: number;
}

export interface BranchReadinessScore {
  branchId: string;
  profileScorePct: number;
  hoursScorePct: number;
  staffScorePct: number;
  menuScorePct: number;
  inventoryScorePct: number;
  deliveryScorePct: number;
  overallReadinessPct: number;
  blockersCount: number;
}

export interface RegionalConfig {
  id: string;
  regionName: string;
  primaryCurrency: string;
  primaryTimezone: string;
  taxLabel: string; // e.g. GST (5%)
  taxRatePct: number;
  supportPhone: string;
  localeLanguage: string;
}

export interface SmartAIBranchInsight {
  id: string;
  branchId: string;
  branchName: string;
  type: 'forecast' | 'staffing_gap' | 'readiness_risk' | 'demand_surge';
  title: string;
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
}

export default BranchProfile;
