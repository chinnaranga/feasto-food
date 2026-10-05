export interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  gateway: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
}
