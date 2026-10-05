import type {
  BranchProfile,
  DayHours,
  SpecialClosure,
  BranchStaffAssignment,
  DeliveryZone,
  BranchPerformanceMetric,
  BranchReadinessScore,
  RegionalConfig,
  SmartAIBranchInsight,
} from '../types/branches';

// ─── Initial Branch Profiles ──────────────────────────────────────────────────
export const INITIAL_BRANCHES: BranchProfile[] = [
  {
    id: 'br-mum-01',
    code: 'BR-MUM-01',
    name: 'Bandra West Flagship',
    region: 'Maharashtra West',
    city: 'Mumbai',
    address: '42 Waterfield Road, Bandra West, Mumbai, MH 400050',
    postalCode: '400050',
    phone: '+91 98200 11223',
    email: 'bandra@feasto.food',
    managerName: 'Hiroshi Sato',
    managerEmail: 'hiroshi@feasto.food',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    status: 'active',
    operationalStatus: 'open',
    openedDate: '2025-01-15',
    seatingCapacity: 84,
    hasKitchenDisplay: true,
    hasDeliveryDispatch: true,
    hasSelfOrderingKiosk: true,
  },
  {
    id: 'br-del-02',
    code: 'BR-DEL-02',
    name: 'Connaught Place Central',
    region: 'Delhi NCR',
    city: 'New Delhi',
    address: 'Block B, Inner Circle, Connaught Place, New Delhi 110001',
    postalCode: '110001',
    phone: '+91 98111 44556',
    email: 'cp.delhi@feasto.food',
    managerName: 'Ananya Sharma',
    managerEmail: 'ananya@feasto.food',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    status: 'active',
    operationalStatus: 'open',
    openedDate: '2025-06-01',
    seatingCapacity: 110,
    hasKitchenDisplay: true,
    hasDeliveryDispatch: true,
    hasSelfOrderingKiosk: false,
  },
  {
    id: 'br-blr-03',
    code: 'BR-BLR-03',
    name: 'Indiranagar Tech Hub',
    region: 'Karnataka South',
    city: 'Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru, KA 560038',
    postalCode: '560038',
    phone: '+91 98450 77889',
    email: 'indiranagar@feasto.food',
    managerName: 'Rohan Verma',
    managerEmail: 'rohan@feasto.food',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    status: 'active',
    operationalStatus: 'open',
    openedDate: '2025-09-10',
    seatingCapacity: 65,
    hasKitchenDisplay: true,
    hasDeliveryDispatch: true,
    hasSelfOrderingKiosk: true,
  },
  {
    id: 'br-hyd-04',
    code: 'BR-HYD-04',
    name: 'Jubilee Hills Gourmet Outlet',
    region: 'Telangana Central',
    city: 'Hyderabad',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, TS 500033',
    postalCode: '500033',
    phone: '+91 98850 33445',
    email: 'jubileehills@feasto.food',
    managerName: 'Priya Reddy',
    managerEmail: 'priya@feasto.food',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    status: 'review_needed',
    operationalStatus: 'kitchen_paused',
    openedDate: '2026-03-01',
    seatingCapacity: 95,
    hasKitchenDisplay: true,
    hasDeliveryDispatch: true,
    hasSelfOrderingKiosk: false,
  },
];

// ─── Default Weekly Hours ─────────────────────────────────────────────────────
export const DEFAULT_BRANCH_HOURS: DayHours[] = [
  { day: 'Monday', isOpen: true, storeOpen: '11:00', storeClose: '23:00', kitchenOpen: '11:00', kitchenClose: '22:30', deliveryOpen: '11:30', deliveryClose: '22:45' },
  { day: 'Tuesday', isOpen: true, storeOpen: '11:00', storeClose: '23:00', kitchenOpen: '11:00', kitchenClose: '22:30', deliveryOpen: '11:30', deliveryClose: '22:45' },
  { day: 'Wednesday', isOpen: true, storeOpen: '11:00', storeClose: '23:00', kitchenOpen: '11:00', kitchenClose: '22:30', deliveryOpen: '11:30', deliveryClose: '22:45' },
  { day: 'Thursday', isOpen: true, storeOpen: '11:00', storeClose: '23:00', kitchenOpen: '11:00', kitchenClose: '22:30', deliveryOpen: '11:30', deliveryClose: '22:45' },
  { day: 'Friday', isOpen: true, storeOpen: '11:00', storeClose: '00:00', kitchenOpen: '11:00', kitchenClose: '23:30', deliveryOpen: '11:30', deliveryClose: '23:45' },
  { day: 'Saturday', isOpen: true, storeOpen: '10:30', storeClose: '00:00', kitchenOpen: '10:30', kitchenClose: '23:30', deliveryOpen: '11:00', deliveryClose: '23:45' },
  { day: 'Sunday', isOpen: true, storeOpen: '10:30', storeClose: '23:30', kitchenOpen: '10:30', kitchenClose: '23:00', deliveryOpen: '11:00', deliveryClose: '23:15' },
];

// ─── Special Closures ─────────────────────────────────────────────────────────
export const INITIAL_SPECIAL_CLOSURES: SpecialClosure[] = [
  {
    id: 'sc-1',
    title: 'Annual Kitchen Deep Clean & Hood Inspection',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    reason: 'renovation',
    affectsDelivery: true,
    affectsPickup: true,
  },
  {
    id: 'sc-2',
    title: 'Ganesh Chaturthi Special Staff Holiday',
    startDate: '2026-09-17',
    endDate: '2026-09-17',
    reason: 'holiday',
    affectsDelivery: true,
    affectsPickup: false,
  },
];

// ─── Staff Assignments Initial List ──────────────────────────────────────────
export const INITIAL_STAFF_ASSIGNMENTS: BranchStaffAssignment[] = [
  { staffId: 'st-1', staffName: 'Hiroshi Sato', role: 'branch_manager', branchId: 'br-mum-01', isPrimaryBranch: true, shiftSchedule: 'Morning (09:00 - 18:00)' },
  { staffId: 'st-2', staffName: 'Kenji Ueda', role: 'head_chef', branchId: 'br-mum-01', isPrimaryBranch: true, shiftSchedule: 'Full Day (11:00 - 22:00)' },
  { staffId: 'st-3', staffName: 'Ananya Sharma', role: 'branch_manager', branchId: 'br-del-02', isPrimaryBranch: true, shiftSchedule: 'Evening (14:00 - 23:00)' },
  { staffId: 'st-4', staffName: 'Rohan Verma', role: 'branch_manager', branchId: 'br-blr-03', isPrimaryBranch: true, shiftSchedule: 'Morning (09:00 - 18:00)' },
  { staffId: 'st-5', staffName: 'Priya Reddy', role: 'branch_manager', branchId: 'br-hyd-04', isPrimaryBranch: true, shiftSchedule: 'Full Day (10:00 - 20:00)' },
];

// ─── Delivery Zones Initial List ─────────────────────────────────────────────
export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', branchId: 'br-mum-01', name: 'Bandra West & Pali Hill', radiusKm: 3.5, serviceablePinCodes: ['400050', '400052'], status: 'active', minOrderAmount: 250, deliveryFee: 35, estimatedDeliveryMins: 25 },
  { id: 'zone-2', branchId: 'br-mum-01', name: 'Khar West & Linking Road', radiusKm: 5.0, serviceablePinCodes: ['400052', '400054'], status: 'active', minOrderAmount: 350, deliveryFee: 50, estimatedDeliveryMins: 35 },
  { id: 'zone-3', branchId: 'br-del-02', name: 'CP & Janpath Inner Radius', radiusKm: 4.0, serviceablePinCodes: ['110001', '110002'], status: 'active', minOrderAmount: 300, deliveryFee: 40, estimatedDeliveryMins: 30 },
  { id: 'zone-4', branchId: 'br-blr-03', name: 'Indiranagar 100ft Corridor', radiusKm: 4.5, serviceablePinCodes: ['560038', '560008'], status: 'active', minOrderAmount: 200, deliveryFee: 30, estimatedDeliveryMins: 20 },
  { id: 'zone-5', branchId: 'br-hyd-04', name: 'Jubilee Hills & Madhapur Tech Park', radiusKm: 6.0, serviceablePinCodes: ['500033', '500081'], status: 'paused', minOrderAmount: 400, deliveryFee: 60, estimatedDeliveryMins: 45 },
];

// ─── Branch Performance Metrics ──────────────────────────────────────────────
export const INITIAL_PERFORMANCE_METRICS: BranchPerformanceMetric[] = [
  { branchId: 'br-mum-01', branchName: 'Bandra West Flagship', dailyRevenue: 148500, dailyOrders: 320, avgOrderValue: 464, fulfillmentSpeedMins: 18, customerRating: 4.9, staffCoveragePct: 98, inventoryHealthPct: 96, rank: 1 },
  { branchId: 'br-del-02', branchName: 'Connaught Place Central', dailyRevenue: 124000, dailyOrders: 280, avgOrderValue: 442, fulfillmentSpeedMins: 22, customerRating: 4.8, staffCoveragePct: 94, inventoryHealthPct: 92, rank: 2 },
  { branchId: 'br-blr-03', branchName: 'Indiranagar Tech Hub', dailyRevenue: 98200, dailyOrders: 210, avgOrderValue: 467, fulfillmentSpeedMins: 16, customerRating: 4.9, staffCoveragePct: 92, inventoryHealthPct: 89, rank: 3 },
  { branchId: 'br-hyd-04', branchName: 'Jubilee Hills Gourmet Outlet', dailyRevenue: 62000, dailyOrders: 115, avgOrderValue: 539, fulfillmentSpeedMins: 32, customerRating: 4.4, staffCoveragePct: 74, inventoryHealthPct: 78, rank: 4 },
];

// ─── Readiness Scores ────────────────────────────────────────────────────────
export const INITIAL_READINESS_SCORES: Record<string, BranchReadinessScore> = {
  'br-mum-01': { branchId: 'br-mum-01', profileScorePct: 100, hoursScorePct: 100, staffScorePct: 98, menuScorePct: 100, inventoryScorePct: 96, deliveryScorePct: 100, overallReadinessPct: 99, blockersCount: 0 },
  'br-del-02': { branchId: 'br-del-02', profileScorePct: 100, hoursScorePct: 100, staffScorePct: 94, menuScorePct: 95, inventoryScorePct: 92, deliveryScorePct: 96, overallReadinessPct: 96, blockersCount: 0 },
  'br-blr-03': { branchId: 'br-blr-03', profileScorePct: 100, hoursScorePct: 100, staffScorePct: 92, menuScorePct: 90, inventoryScorePct: 89, deliveryScorePct: 95, overallReadinessPct: 94, blockersCount: 0 },
  'br-hyd-04': { branchId: 'br-hyd-04', profileScorePct: 85, hoursScorePct: 80, staffScorePct: 74, menuScorePct: 70, inventoryScorePct: 78, deliveryScorePct: 50, overallReadinessPct: 73, blockersCount: 2 },
};

// ─── Regional Policy Configurations ──────────────────────────────────────────
export const INITIAL_REGIONS: RegionalConfig[] = [
  { id: 'reg-west', regionName: 'Maharashtra West', primaryCurrency: 'INR (₹)', primaryTimezone: 'Asia/Kolkata (IST)', taxLabel: 'GST (5%)', taxRatePct: 5, supportPhone: '+91 22 4000 1100', localeLanguage: 'English (IN)' },
  { id: 'reg-north', regionName: 'Delhi NCR', primaryCurrency: 'INR (₹)', primaryTimezone: 'Asia/Kolkata (IST)', taxLabel: 'GST (5%)', taxRatePct: 5, supportPhone: '+91 11 4000 2200', localeLanguage: 'English (IN)' },
  { id: 'reg-south-1', regionName: 'Karnataka South', primaryCurrency: 'INR (₹)', primaryTimezone: 'Asia/Kolkata (IST)', taxLabel: 'GST (5%)', taxRatePct: 5, supportPhone: '+91 80 4000 3300', localeLanguage: 'English (IN)' },
  { id: 'reg-south-2', regionName: 'Telangana Central', primaryCurrency: 'INR (₹)', primaryTimezone: 'Asia/Kolkata (IST)', taxLabel: 'GST (5%)', taxRatePct: 5, supportPhone: '+91 40 4000 4400', localeLanguage: 'English (IN)' },
];

// ─── Smart AI Branch Insights ────────────────────────────────────────────────
export const INITIAL_BRANCH_AI_INSIGHTS: SmartAIBranchInsight[] = [
  { id: 'ai-b1', branchId: 'br-hyd-04', branchName: 'Jubilee Hills Gourmet Outlet', type: 'readiness_risk', title: 'Staffing Coverage Gap Detected', description: 'Jubilee Hills operates at 74% staffing capacity. Weekend dinner rush prep speed drops by 32%.', recommendation: 'Reassign 2 line chefs from Indiranagar branch to stabilize Friday dinner SLA.', severity: 'high' },
  { id: 'ai-b2', branchId: 'br-blr-03', branchName: 'Indiranagar Tech Hub', type: 'demand_surge', title: 'Friday Lunch Demand Surge Expected', description: 'IT park order volume projected to increase +28% due to tech company team lunches.', recommendation: 'Extend delivery radius by 1.5km during 12:00 - 15:00 window.', severity: 'medium' },
];
