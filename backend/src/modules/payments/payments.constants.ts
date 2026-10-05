export const PAYMENT_GATEWAYS = ['stripe', 'razorpay', 'cashfree', 'wallet', 'cod', 'cash'] as const;
export type PaymentGateway = (typeof PAYMENT_GATEWAYS)[number];

export const PAYMENT_METHODS = ['card', 'upi', 'netbanking', 'wallet', 'cash_on_delivery', 'cod', 'cashfree'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = [
  'pending',
  'authorized',
  'captured',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CAPTURE_STATUSES = ['not_captured', 'captured', 'failed'] as const;
export type CaptureStatus = (typeof CAPTURE_STATUSES)[number];

export const REFUND_STATUSES = ['none', 'partial', 'full'] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];

export const PAYOUT_STATUSES = ['unpaid', 'initiated', 'pending', 'processing', 'paid', 'completed', 'failed', 'cancelled'] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export const SETTLEMENT_STATUSES = ['unsettled', 'pending', 'settled', 'reconciled'] as const;
export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export const TRANSACTION_TYPES = [
  'credit',
  'debit',
  'fee',
  'tax',
  'refund',
  'payout',
  'settlement',
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_STATUSES = [
  'pending',
  'completed',
  'failed',
  'refunded',
  'reconciled',
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const WALLET_OWNER_TYPES = ['customer', 'restaurant', 'rider'] as const;
export type WalletOwnerType = (typeof WALLET_OWNER_TYPES)[number];

export const WALLET_STATUSES = ['active', 'frozen', 'closed'] as const;
export type WalletStatus = (typeof WALLET_STATUSES)[number];

export const WALLET_ENTRY_TYPES = ['credit', 'debit', 'adjustment'] as const;
export type WalletEntryType = (typeof WALLET_ENTRY_TYPES)[number];

export const PAYOUT_METHODS = ['bank_transfer', 'upi', 'wallet'] as const;
export type PayoutMethod = (typeof PAYOUT_METHODS)[number];

export const REFUND_LIFECYCLE_STATUSES = [
  'initiated',
  'pending',
  'approved',
  'rejected',
  'completed',
  'failed',
] as const;
export type RefundLifecycleStatus = (typeof REFUND_LIFECYCLE_STATUSES)[number];

export const DEFAULT_CURRENCY = 'INR';
export const PLATFORM_COMMISSION_PERCENTAGE = 15; // 15% platform commission default
export const DEFAULT_TAX_PERCENTAGE = 5; // 5% GST default
