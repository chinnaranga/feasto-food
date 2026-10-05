export const SOCKET_EVENTS = {
  // ORDER EVENTS
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_STATUS_CHANGED: 'order.status_changed',

  // DISPATCH & RIDER EVENTS
  DISPATCH_OFFER_CREATED: 'dispatch.offer.created',
  RIDER_OFFER_ACCEPTED: 'rider.offer.accepted',
  RIDER_OFFER_REJECTED: 'rider.offer.rejected',
  DELIVERY_ASSIGNED: 'delivery.assigned',
  LOCATION_UPDATE: 'tracking.location_update',

  // NOTIFICATION EVENTS
  NOTIFICATION_NEW: 'notification.new',
} as const;
