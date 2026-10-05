import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from '../payments.types.js';
import { WALLET_OWNER_TYPES, WALLET_STATUSES, DEFAULT_CURRENCY } from '../payments.constants.js';

export interface WalletDocument extends IWallet, Document {}

const WalletSchema = new Schema<WalletDocument>(
  {
    walletId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    ownerType: {
      type: String,
      enum: WALLET_OWNER_TYPES,
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pendingBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lockedBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: DEFAULT_CURRENCY,
    },
    status: {
      type: String,
      enum: WALLET_STATUSES,
      required: true,
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

export const WalletModel = mongoose.model<WalletDocument>('Wallet', WalletSchema);
