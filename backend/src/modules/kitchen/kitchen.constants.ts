export const KITCHEN_STATIONS_DEFAULT = [
  { name: 'Main Kitchen', code: 'KITCHEN' },
  { name: 'Grill & Fryer', code: 'GRILL' },
  { name: 'Beverage Bar', code: 'BEVERAGE' },
  { name: 'Dessert Station', code: 'DESSERT' },
  { name: 'Packing & Dispatch', code: 'PACKING' },
] as const;

export const ITEM_PREPARATION_STATUSES = [
  'PENDING',
  'PREPARING',
  'COMPLETED',
  'CANCELLED',
] as const;
export type ItemPreparationStatus = (typeof ITEM_PREPARATION_STATUSES)[number];

export const KITCHEN_ORDER_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
export type KitchenOrderPriority = (typeof KITCHEN_ORDER_PRIORITIES)[number];
