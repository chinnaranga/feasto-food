import { OrderType, OrderStatus, PaymentStatus, FulfillmentStatus } from './orders.model.js';

export interface AddCartItemDTO {
  restaurantId: string;
  branchId: string;
  itemId: string;
  variantId?: string;
  variantName?: string;
  basePrice: number;
  quantity: number;
  addons?: Array<{
    addonId?: string;
    name: string;
    price: number;
  }>;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

export interface InitializeCheckoutDTO {
  deliveryAddressId?: string;
  orderType?: OrderType;
  tipAmount?: number;
  specialInstructions?: string;
}

export interface CreateOrderDTO {
  checkoutSessionId: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string;
}

export interface CancelOrderDTO {
  reason: string;
}

export interface OrderQueueSummaryResponse {
  restaurantId: string;
  stats: {
    pendingOrdersCount: number;
    activeOrdersCount: number;
    completedOrdersCount: number;
    cancelledOrdersCount: number;
  };
}
