import { apiClient } from './client';
import { PaymentDetails } from '@/types/api/payment';

export const paymentApi = {
  createPaymentIntent(orderId: string, amount: number): Promise<PaymentDetails> {
    return apiClient.post<PaymentDetails>('/payments/intent', { orderId, amount });
  },

  verifyPayment(paymentId: string, signature: string): Promise<PaymentDetails> {
    return apiClient.post<PaymentDetails>(`/payments/${paymentId}/verify`, { signature });
  },
};
