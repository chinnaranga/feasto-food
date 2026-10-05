import { apiClient } from './client';
import { OrderItemPayload } from '@/types/api/order';

export const orderApi = {
  createOrder(payload: any): Promise<OrderItemPayload> {
    return apiClient.post<OrderItemPayload>('/orders', payload);
  },

  getOrders(): Promise<OrderItemPayload[]> {
    return apiClient.get<OrderItemPayload[]>('/orders');
  },

  getOrderById(orderId: string): Promise<OrderItemPayload> {
    return apiClient.get<OrderItemPayload>(`/orders/${orderId}`);
  },
};
