export interface OrderItem {
  itemId: string;
  itemName: string;
  basePrice: number;
  quantity: number;
  itemTotal: number;
}

export interface OrderItemPayload {
  orderId: string;
  orderNumber: string;
  orderStatus: 'placed' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  pricingSnapshot: {
    subtotal: number;
    taxAmount: number;
    deliveryFee: number;
    totalAmount: number;
  };
  createdAt: string;
}
