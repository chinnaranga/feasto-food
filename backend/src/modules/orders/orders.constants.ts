export const ORDER_CONSTANTS = {
  TAX_RATE: 0.08, // 8% sales tax
  DEFAULT_PACKAGING_FEE: 1.5,
  DEFAULT_DELIVERY_FEE: 3.99,
  CHECKOUT_SESSION_TTL_MINUTES: 30,
} as const;

export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  placed: ['accepted', 'rejected', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'delivered', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
  rejected: [],
};

export const ORDER_ERROR_CODES = {
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  CART_EMPTY: 'CART_EMPTY',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  CHECKOUT_EXPIRED: 'CHECKOUT_EXPIRED',
  RESTAURANT_CLOSED: 'RESTAURANT_CLOSED',
  MIN_ORDER_VALUE_NOT_MET: 'MIN_ORDER_VALUE_NOT_MET',
  UNAUTHORIZED_ORDER_ACCESS: 'UNAUTHORIZED_ORDER_ACCESS',
} as const;
