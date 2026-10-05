export const RIDER_CONSTANTS = {
  REQUIRED_DOCUMENT_TYPES: [
    'driver_license',
    'national_id',
    'vehicle_registration',
    'insurance_proof',
  ],
  SUPPORTED_VEHICLE_TYPES: ['bicycle', 'scooter', 'motorcycle', 'car'],
} as const;

export const RIDER_DELIVERY_TRANSITIONS: Record<string, string[]> = {
  assigned: ['arrived_at_restaurant', 'cancelled'],
  arrived_at_restaurant: ['picked_up', 'cancelled'],
  picked_up: ['arrived_at_customer', 'cancelled'],
  arrived_at_customer: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export const RIDER_ERROR_CODES = {
  RIDER_NOT_FOUND: 'RIDER_NOT_FOUND',
  VEHICLE_NOT_FOUND: 'VEHICLE_NOT_FOUND',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  ASSIGNMENT_NOT_FOUND: 'ASSIGNMENT_NOT_FOUND',
  UNAUTHORIZED_RIDER_ACCESS: 'UNAUTHORIZED_RIDER_ACCESS',
  RIDER_NOT_ELIGIBLE_FOR_DISPATCH: 'RIDER_NOT_ELIGIBLE_FOR_DISPATCH',
  INVALID_DELIVERY_TRANSITION: 'INVALID_DELIVERY_TRANSITION',
} as const;
