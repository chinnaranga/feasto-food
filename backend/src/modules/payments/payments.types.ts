import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  CaptureStatus,
  RefundStatus,
  PayoutStatus,
  SettlementStatus,
  TransactionType,
  TransactionStatus,
  WalletOwnerType,
  WalletStatus,
  WalletEntryType,
  PayoutMethod,
  RefundLifecycleStatus,
} from './payments.constants.js';

export interface IPayment {
  _id?: string;
  paymentId: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  riderId?: string;
  walletId?: string;
  transactionId?: string;
  gateway: PaymentGateway;
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  captureStatus: CaptureStatus;
  refundStatus: RefundStatus;
  amount: number;
  currency: string;
  taxAmount: number;
  feeAmount: number;
  netAmount: number;
  paymentIntentStatus?: string;
  payoutStatus: PayoutStatus;
  settlementStatus: SettlementStatus;
  capturedAt?: Date;
  refundedAt?: Date;
  settledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransaction {
  _id?: string;
  transactionId: string;
  paymentId?: string;
  orderId?: string;
  customerId?: string;
  restaurantId?: string;
  riderId?: string;
  walletId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
  reconciled: boolean;
  reconciledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWallet {
  _id?: string;
  walletId: string;
  ownerId: string;
  ownerType: WalletOwnerType;
  balance: number;
  pendingBalance: number;
  lockedBalance: number;
  currency: string;
  status: WalletStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWalletEntry {
  _id?: string;
  entryId: string;
  walletId: string;
  type: WalletEntryType;
  amount: number;
  previousBalance: number;
  newBalance: number;
  referenceType: 'order' | 'payout' | 'refund' | 'adjustment';
  referenceId: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayout {
  _id?: string;
  payoutId: string;
  recipientId: string;
  recipientType: 'restaurant' | 'rider';
  walletId?: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  payoutMethod: PayoutMethod;
  gatewayPayoutId?: string;
  failureReason?: string;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISettlement {
  _id?: string;
  settlementId: string;
  restaurantId: string;
  riderId?: string;
  orderId: string;
  grossAmount: number;
  commissionAmount: number;
  feeBreakdown: {
    gatewayFee: number;
    platformFee: number;
  };
  taxBreakdown: {
    gstAmount: number;
    tdsAmount: number;
  };
  netSettlementAmount: number;
  status: SettlementStatus;
  reconciled: boolean;
  settledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRefund {
  _id?: string;
  refundId: string;
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: RefundLifecycleStatus;
  reason: string;
  gatewayRefundId?: string;
  approvedBy?: string;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGatewayEvent {
  _id?: string;
  eventId: string;
  gateway: string;
  eventType: string;
  payload: Record<string, any>;
  signature?: string;
  processed: boolean;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFinancialActivity {
  _id?: string;
  activityId: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: 'payment' | 'transaction' | 'wallet' | 'payout' | 'refund' | 'settlement';
  entityId: string;
  details?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFinancialSummary {
  totalPayments: number;
  successfulPaymentsCount: number;
  failedPaymentsCount: number;
  refundedPaymentsCount: number;
  totalVolumeAmount: number;
  pendingPayoutsCount: number;
  completedPayoutsCount: number;
  totalWalletBalance: number;
  unsettledAmount: number;
  reconciledTransactionsCount: number;
}
