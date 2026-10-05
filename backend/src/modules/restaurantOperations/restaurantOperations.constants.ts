export const RESTAURANT_OPERATIONAL_STATUSES = [
  'OPEN',
  'BUSY',
  'PAUSED',
  'CLOSED',
  'TEMPORARILY_UNAVAILABLE',
] as const;
export type RestaurantOperationalStatus = (typeof RESTAURANT_OPERATIONAL_STATUSES)[number];

export const RESTAURANT_SUB_STATES = [
  'WAITING_FOR_RESTAURANT',
  'RESTAURANT_ACCEPTED',
  'KITCHEN_QUEUED',
  'PREPARING',
  'QUALITY_CHECK',
  'READY_FOR_PICKUP',
  'HANDOFF_IN_PROGRESS',
  'HANDED_TO_RIDER',
] as const;
export type RestaurantSubState = (typeof RESTAURANT_SUB_STATES)[number];

export const DELAY_REASONS = [
  'kitchen_overload',
  'ingredient_shortage',
  'equipment_issue',
  'staff_shortage',
  'unexpected_demand',
  'technical_issue',
  'other',
] as const;
export type DelayReason = (typeof DELAY_REASONS)[number];

export const RESTAURANT_PERMISSIONS = {
  ORDERS_READ: 'restaurant:orders:read',
  ORDERS_ACCEPT: 'restaurant:orders:accept',
  ORDERS_REJECT: 'restaurant:orders:reject',
  ORDERS_PREPARE: 'restaurant:orders:prepare',
  ORDERS_READY: 'restaurant:orders:ready',
  ORDERS_DELAY: 'restaurant:orders:delay',
  KITCHEN_READ: 'restaurant:kitchen:read',
  KITCHEN_MANAGE: 'restaurant:kitchen:manage',
  STAFF_READ: 'restaurant:staff:read',
  STAFF_MANAGE: 'restaurant:staff:manage',
} as const;
