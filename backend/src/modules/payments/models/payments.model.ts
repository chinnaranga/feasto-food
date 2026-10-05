import mongoose, { Schema, Document } from 'mongoose';
import { IPayment } from '../payments.types.js';
import {
  PAYMENT_GATEWAYS,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  CAPTURE_STATUSES,
  REFUND_STATUSES,
  PAYOUT_STATUSES,
  SETTLEMENT_STATUSES,
  DEFAULT_CURRENCY,
} from '../payments.constants.js';

export interface PaymentDocument extends Omit<IPayment, '_id'>, Document {}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: String,
      index: true,
    },
    walletId: {
      type: String,
      index: true,
    },
    transactionId: {
      type: String,
      index: true,
    },
    gateway: {
      type: String,
      enum: PAYMENT_GATEWAYS,
      required: true,
      default: 'razorpay',
    },
    gatewayPaymentId: {
      type: String,
      index: true,
    },
    gatewayOrderId: {
      type: String,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      required: true,
      default: 'pending',
      index: true,
    },
    captureStatus: {
      type: String,
      enum: CAPTURE_STATUSES,
      required: true,
      default: 'not_captured',
    },
    refundStatus: {
      type: String,
      enum: REFUND_STATUSES,
      required: true,
      default: 'none',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: DEFAULT_CURRENCY,
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    feeAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentIntentStatus: {
      type: String,
      default: 'created',
    },
    payoutStatus: {
      type: String,
      enum: PAYOUT_STATUSES,
      required: true,
      default: 'unpaid',
    },
    settlementStatus: {
      type: String,
      enum: SETTLEMENT_STATUSES,
      required: true,
      default: 'unsettled',
    },
    capturedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    settledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ customerId: 1, createdAt: -1 });
PaymentSchema.index({ restaurantId: 1, paymentStatus: 1 });
PaymentSchema.index({ orderId: 1 });

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', PaymentSchema);
