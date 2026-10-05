import mongoose, { Schema, Document } from 'mongoose';
import { IWalletEntry } from '../payments.types.js';
import { WALLET_ENTRY_TYPES } from '../payments.constants.js';

export interface WalletEntryDocument extends IWalletEntry, Document {}

const WalletEntrySchema = new Schema<WalletEntryDocument>(
  {
    entryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    walletId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: WALLET_ENTRY_TYPES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    referenceType: {
      type: String,
      enum: ['order', 'payout', 'refund', 'adjustment'],
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WalletEntrySchema.index({ walletId: 1, createdAt: -1 });

export const WalletEntryModel = mongoose.model<WalletEntryDocument>('WalletEntry', WalletEntrySchema);
