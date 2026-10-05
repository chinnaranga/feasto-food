import type {
  RiderProfile,
  DeliveryOffer,
  RiderEarningsSummary,
  RiderVehicleInfo,
  RiderDocumentItem,
} from '../types';

// ─── Initial Rider Profile ────────────────────────────────────────────────────
export const MOCK_RIDER_PROFILE: RiderProfile = {
  id: 'rdr-101',
  riderCode: 'RDR-8802',
  fullName: 'Arjun Kumar',
  phone: '+91 98765 43210',
  email: 'arjun.rider@feasto.food',
  rating: 4.92,
  totalCompletedDeliveries: 1420,
  acceptanceRatePct: 96,
  completionRatePct: 99.4,
  joinedDate: '2025-03-10',
  walletBalance: 2450.0,
  pendingPayout: 840.0,
  vehicleType: 'scooter_ev',
  vehiclePlateNumber: 'MH 02 EV 4821',
  vehicleModel: 'Ather 450X Apex',
  currentZone: 'Bandra West & Khar Zone',
  availability: 'online',
};

// ─── Initial Delivery Offers ──────────────────────────────────────────────────
export const MOCK_DELIVERY_OFFERS: DeliveryOffer[] = [
  {
    id: 'off-8801',
    orderNumber: '#1809',
    restaurantName: 'La Pasta Bella - Bandra',
    restaurantAddress: '42 Waterfield Road, Bandra West',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98200 99887',
    dropoffAddress: 'Flat 402, Sea Crest Apartments, Carter Road, Bandra West',
    pickupDistanceKm: 1.2,
    dropoffDistanceKm: 2.8,
    totalDistanceKm: 4.0,
    estimatedTimeMins: 22,
    payoutAmount: 85,
    tipAmount: 30,
    itemCount: 3,
    pickupSla: '10 mins',
    expiresInSeconds: 45,
    status: 'accepted',
  },
  {
    id: 'off-8802',
    orderNumber: '#1812',
    restaurantName: 'Bombay Biryani House',
    restaurantAddress: 'Hill Road, Bandra West',
    customerName: 'Neha Sharma',
    customerPhone: '+91 98111 22334',
    dropoffAddress: 'Bunglow 12, Pali Hill, Bandra West',
    pickupDistanceKm: 0.8,
    dropoffDistanceKm: 1.9,
    totalDistanceKm: 2.7,
    estimatedTimeMins: 16,
    payoutAmount: 65,
    tipAmount: 20,
    itemCount: 2,
    pickupSla: '8 mins',
    expiresInSeconds: 60,
    status: 'pending',
  },
];

// ─── Earnings Summary ─────────────────────────────────────────────────────────
export const MOCK_EARNINGS_SUMMARY: RiderEarningsSummary = {
  todayEarnings: 1420.0,
  todayTrips: 12,
  todayOnlineMinutes: 340,
  todayTips: 180.0,
  todayIncentives: 250.0,
  weeklyEarnings: 8950.0,
  weeklyTrips: 74,
};

// ─── Vehicle Info ─────────────────────────────────────────────────────────────
export const MOCK_VEHICLE_INFO: RiderVehicleInfo = {
  type: 'scooter_ev',
  makeModel: 'Ather 450X Apex (Electric)',
  plateNumber: 'MH 02 EV 4821',
  color: 'Space Grey',
  verificationStatus: 'verified',
  registrationExpiry: '2028-04-15',
  insuranceExpiry: '2026-11-30',
};

// ─── Document Items ───────────────────────────────────────────────────────────
export const MOCK_DOCUMENTS: RiderDocumentItem[] = [
  { id: 'doc-1', title: 'Permanent Driving License', documentType: 'driving_license', status: 'verified', expiryDate: '2032-09-20', lastUpdated: '2025-03-10' },
  { id: 'doc-2', title: 'Aadhaar Identity Card', documentType: 'aadhaar', status: 'verified', lastUpdated: '2025-03-10' },
  { id: 'doc-3', title: 'Vehicle Registration Certificate (RC)', documentType: 'vehicle_rc', status: 'verified', expiryDate: '2028-04-15', lastUpdated: '2025-03-10' },
  { id: 'doc-4', title: 'Third Party Commercial Insurance', documentType: 'insurance', status: 'verified', expiryDate: '2026-11-30', lastUpdated: '2025-11-01' },
];

// ─── Bottom Nav Bar Config ───────────────────────────────────────────────────
export const RIDER_BOTTOM_NAV_ITEMS = [
  { id: 'nav-dashboard', label: 'Dashboard', path: '/rider/dashboard', icon: 'Home' },
  { id: 'nav-orders', label: 'Offers', path: '/rider/orders', icon: 'ShoppingBag', badge: 1 },
  { id: 'nav-active', label: 'Active Task', path: '/rider/active', icon: 'Navigation', badge: 1 },
  { id: 'nav-earnings', label: 'Earnings', path: '/rider/earnings', icon: 'Wallet' },
  { id: 'nav-profile', label: 'Profile', path: '/rider/profile', icon: 'User' },
];
