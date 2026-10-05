import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../payments.types.js';
import { TRANSACTION_TYPES, TRANSACTION_STATUSES, DEFAULT_CURRENCY } from '../payments.constants.js';

export interface TransactionDocument extends ITransaction, Document {}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      index: true,
    },
    orderId: {
      type: String,
      index: true,
    },
    customerId: {
      type: String,
      index: true,
    },
    restaurantId: {
      type: String,
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
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      required: true,
      default: 'pending',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: DEFAULT_CURRENCY,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    reconciled: {
      type: Boolean,
      default: false,
    },
    reconciledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ customerId: 1, createdAt: -1 });
TransactionSchema.index({ restaurantId: 1, createdAt: -1 });
TransactionSchema.index({ walletId: 1, createdAt: -1 });

export const TransactionModel = mongoose.model<TransactionDocument>('Transaction', TransactionSchema);
