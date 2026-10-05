import { ItemPreparationStatus, KitchenOrderPriority } from './kitchen.constants.js';

export interface IKitchenStation {
  _id?: any;
  stationId: string;
  restaurantId: string;
  branchId?: string;
  name: string;
  code: string;
  status: 'active' | 'inactive' | 'busy';
  displayOrder: number;
  capacity: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IKitchenItem {
  _id?: any;
  kitchenItemId: string;
  kitchenOrderId: string;
  orderId: string;
  restaurantId: string;
  itemId: string;
  itemName: string;
  stationId?: string;
  stationCode?: string;
  quantity: number;
  variantName?: string;
  addons?: Array<{ name: string; price: number }>;
  specialInstructions?: string;
  status: ItemPreparationStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IKitchenOrder {
  _id?: any;
  kitchenOrderId: string;
  orderId: string;
  orderNumber: string;
  restaurantId: string;
  branchId?: string;
  priority: KitchenOrderPriority;
  status: 'QUEUED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  itemCount: number;
  completedItemCount: number;
  estimatedPreparationTimeMinutes: number;
  actualPreparationTimeMinutes?: number;
  preparationStartedAt?: Date;
  preparationCompletedAt?: Date;
  expectedReadyAt?: Date;
  delayMinutes: number;
  delayReason?: string;
  specialInstructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
