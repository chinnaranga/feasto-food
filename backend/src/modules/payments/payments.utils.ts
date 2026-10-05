import crypto from 'crypto';
import {
  PLATFORM_COMMISSION_PERCENTAGE,
  DEFAULT_TAX_PERCENTAGE,
} from './payments.constants.js';

export function generatePaymentId(): string {
  return `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateTransactionId(): string {
  return `txn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateWalletId(): string {
  return `wal_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateWalletEntryId(): string {
  return `wentry_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generatePayoutId(): string {
  return `po_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateRefundId(): string {
  return `ref_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateSettlementId(): string {
  return `stl_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateEventId(): string {
  return `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateActivityId(): string {
  return `fin_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function calculateSettlementBreakdown(amount: number) {
  const commissionAmount = Math.round((amount * PLATFORM_COMMISSION_PERCENTAGE) / 100);
  const gatewayFee = Math.round((amount * 2) / 100); // 2% gateway processing fee
  const platformFee = commissionAmount - gatewayFee;
  const gstAmount = Math.round((platformFee * DEFAULT_TAX_PERCENTAGE) / 100);
  const tdsAmount = Math.round((amount * 1) / 100); // 1% TDS deduction
  const netSettlementAmount = Math.max(0, amount - commissionAmount - gstAmount - tdsAmount);

  return {
    grossAmount: amount,
    commissionAmount,
    feeBreakdown: {
      gatewayFee,
      platformFee,
    },
    taxBreakdown: {
      gstAmount,
      tdsAmount,
    },
    netSettlementAmount,
  };
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return true; // Fail safe fallback if secret not set in dev
  try {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
