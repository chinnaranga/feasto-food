import { z } from 'zod';
import {
  PAYMENT_GATEWAYS,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PAYOUT_METHODS,
  PAYOUT_STATUSES,
  REFUND_LIFECYCLE_STATUSES,
  SETTLEMENT_STATUSES,
} from './payments.constants.js';

export const initializePaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  riderId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  gateway: z.enum(PAYMENT_GATEWAYS).default('razorpay'),
  paymentMethod: z.enum(PAYMENT_METHODS).default('card'),
});

export const confirmPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  gatewayPaymentId: z.string().optional(),
  gatewayOrderId: z.string().optional(),
  status: z.enum(['captured', 'failed', 'cancelled']).default('captured'),
  failureReason: z.string().optional(),
});

export const cancelPaymentSchema = z.object({
  reason: z.string().optional(),
});

export const walletCreditDebitSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  referenceType: z.enum(['order', 'payout', 'refund', 'adjustment']).default('adjustment'),
  referenceId: z.string().min(1, 'Reference ID is required'),
  description: z.string().min(1, 'Description is required'),
});

export const walletUpdateSchema = z.object({
  status: z.enum(['active', 'frozen', 'closed']),
});

export const payoutCreateSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  recipientType: z.enum(['restaurant', 'rider']),
  amount: z.number().positive('Payout amount must be positive'),
  payoutMethod: z.enum(PAYOUT_METHODS).default('bank_transfer'),
  currency: z.string().default('INR'),
});

export const payoutUpdateSchema = z.object({
  status: z.enum(PAYOUT_STATUSES),
  failureReason: z.string().optional(),
});

export const refundCreateSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().positive('Refund amount must be positive'),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
});

export const refundUpdateSchema = z.object({
  status: z.enum(REFUND_LIFECYCLE_STATUSES),
  reason: z.string().optional(),
});

export const refundApproveRejectSchema = z.object({
  reason: z.string().optional(),
});

export const reconcileTransactionSchema = z.object({
  reconciled: z.boolean().default(true),
  notes: z.string().optional(),
});

export const reconcileSettlementSchema = z.object({
  reconciled: z.boolean().default(true),
  status: z.enum(SETTLEMENT_STATUSES).default('reconciled'),
});

export const webhookPayloadSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  data: z.record(z.any()),
  signature: z.string().optional(),
});
