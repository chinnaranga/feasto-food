import { PaymentModel, PaymentDocument } from './models/payments.model.js';
import { TransactionModel, TransactionDocument } from './models/transaction.model.js';
import { WalletModel, WalletDocument } from './models/wallet.model.js';
import { WalletEntryModel, WalletEntryDocument } from './models/walletEntry.model.js';
import { PayoutModel, PayoutDocument } from './models/payout.model.js';
import { RefundModel, RefundDocument } from './models/refund.model.js';
import { SettlementModel, SettlementDocument } from './models/settlement.model.js';
import { GatewayEventModel, GatewayEventDocument } from './models/gatewayEvent.model.js';
import { FinancialActivityModel, FinancialActivityDocument } from './models/financialActivity.model.js';
import {
  IPayment,
  ITransaction,
  IWallet,
  IWalletEntry,
  IPayout,
  IRefund,
  ISettlement,
  IGatewayEvent,
  IFinancialActivity,
} from './payments.types.js';

export class PaymentsRepository {
  // PAYMENTS
  async createPayment(paymentData: Partial<IPayment>): Promise<PaymentDocument> {
    return PaymentModel.create(paymentData);
  }

  async findPaymentById(paymentId: string): Promise<PaymentDocument | null> {
    return PaymentModel.findOne({ paymentId });
  }

  async findPaymentByOrderId(orderId: string): Promise<PaymentDocument | null> {
    return PaymentModel.findOne({ orderId });
  }

  async findPayments(query: Record<string, any>, limit = 50, skip = 0): Promise<PaymentDocument[]> {
    return PaymentModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updatePayment(paymentId: string, updateData: Partial<IPayment>): Promise<PaymentDocument | null> {
    return PaymentModel.findOneAndUpdate({ paymentId }, updateData, { new: true });
  }

  // TRANSACTIONS
  async createTransaction(transactionData: Partial<ITransaction>): Promise<TransactionDocument> {
    return TransactionModel.create(transactionData);
  }

  async findTransactionById(transactionId: string): Promise<TransactionDocument | null> {
    return TransactionModel.findOne({ transactionId });
  }

  async findTransactions(query: Record<string, any>, limit = 50, skip = 0): Promise<TransactionDocument[]> {
    return TransactionModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updateTransaction(transactionId: string, updateData: Partial<ITransaction>): Promise<TransactionDocument | null> {
    return TransactionModel.findOneAndUpdate({ transactionId }, updateData, { new: true });
  }

  // WALLETS
  async createWallet(walletData: Partial<IWallet>): Promise<WalletDocument> {
    return WalletModel.create(walletData);
  }

  async findWalletById(walletId: string): Promise<WalletDocument | null> {
    return WalletModel.findOne({ walletId });
  }

  async findWalletByOwner(ownerId: string, ownerType: 'customer' | 'restaurant' | 'rider'): Promise<WalletDocument | null> {
    return WalletModel.findOne({ ownerId, ownerType });
  }

  async findWallets(query: Record<string, any>, limit = 50, skip = 0): Promise<WalletDocument[]> {
    return WalletModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updateWalletBalance(walletId: string, balanceDelta: number, pendingDelta = 0): Promise<WalletDocument | null> {
    return WalletModel.findOneAndUpdate(
      { walletId },
      { $inc: { balance: balanceDelta, pendingBalance: pendingDelta } },
      { new: true }
    );
  }

  async updateWallet(walletId: string, updateData: Partial<IWallet>): Promise<WalletDocument | null> {
    return WalletModel.findOneAndUpdate({ walletId }, updateData, { new: true });
  }

  // WALLET ENTRIES
  async createWalletEntry(entryData: Partial<IWalletEntry>): Promise<WalletEntryDocument> {
    return WalletEntryModel.create(entryData);
  }

  async findWalletEntries(walletId: string, limit = 50, skip = 0): Promise<WalletEntryDocument[]> {
    return WalletEntryModel.find({ walletId }).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  // PAYOUTS
  async createPayout(payoutData: Partial<IPayout>): Promise<PayoutDocument> {
    return PayoutModel.create(payoutData);
  }

  async findPayoutById(payoutId: string): Promise<PayoutDocument | null> {
    return PayoutModel.findOne({ payoutId });
  }

  async findPayouts(query: Record<string, any>, limit = 50, skip = 0): Promise<PayoutDocument[]> {
    return PayoutModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updatePayout(payoutId: string, updateData: Partial<IPayout>): Promise<PayoutDocument | null> {
    return PayoutModel.findOneAndUpdate({ payoutId }, updateData, { new: true });
  }

  // REFUNDS
  async createRefund(refundData: Partial<IRefund>): Promise<RefundDocument> {
    return RefundModel.create(refundData);
  }

  async findRefundById(refundId: string): Promise<RefundDocument | null> {
    return RefundModel.findOne({ refundId });
  }

  async findRefunds(query: Record<string, any>, limit = 50, skip = 0): Promise<RefundDocument[]> {
    return RefundModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updateRefund(refundId: string, updateData: Partial<IRefund>): Promise<RefundDocument | null> {
    return RefundModel.findOneAndUpdate({ refundId }, updateData, { new: true });
  }

  // SETTLEMENTS
  async createSettlement(settlementData: Partial<ISettlement>): Promise<SettlementDocument> {
    return SettlementModel.create(settlementData);
  }

  async findSettlementById(settlementId: string): Promise<SettlementDocument | null> {
    return SettlementModel.findOne({ settlementId });
  }

  async findSettlementByOrderId(orderId: string): Promise<SettlementDocument | null> {
    return SettlementModel.findOne({ orderId });
  }

  async findSettlements(query: Record<string, any>, limit = 50, skip = 0): Promise<SettlementDocument[]> {
    return SettlementModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updateSettlement(settlementId: string, updateData: Partial<ISettlement>): Promise<SettlementDocument | null> {
    return SettlementModel.findOneAndUpdate({ settlementId }, updateData, { new: true });
  }

  // GATEWAY EVENTS
  async createGatewayEvent(eventData: Partial<IGatewayEvent>): Promise<GatewayEventDocument> {
    return GatewayEventModel.create(eventData);
  }

  async findGatewayEventById(eventId: string): Promise<GatewayEventDocument | null> {
    return GatewayEventModel.findOne({ eventId });
  }

  // FINANCIAL AUDIT LOGS
  async logFinancialActivity(activityData: Partial<IFinancialActivity>): Promise<FinancialActivityDocument> {
    return FinancialActivityModel.create(activityData);
  }

  // AGGREGATIONS & SUMMARY
  async getFinancialSummary(): Promise<{
    totalPayments: number;
    successfulPaymentsCount: number;
    failedPaymentsCount: number;
    refundedPaymentsCount: number;
    totalVolumeAmount: number;
    pendingPayoutsCount: number;
    completedPayoutsCount: number;
    unsettledAmount: number;
    reconciledTransactionsCount: number;
  }> {
    const [paymentsStats, payoutsStats, settlementsStats, transactionsStats] = await Promise.all([
      PaymentModel.aggregate([
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            successfulPaymentsCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'captured'] }, 1, 0] },
            },
            failedPaymentsCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] },
            },
            refundedPaymentsCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] },
            },
            totalVolumeAmount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'captured'] }, '$amount', 0] },
            },
          },
        },
      ]),
      PayoutModel.aggregate([
        {
          $group: {
            _id: null,
            pendingPayoutsCount: {
              $sum: { $cond: [{ $in: ['$status', ['initiated', 'pending', 'processing']] }, 1, 0] },
            },
            completedPayoutsCount: {
              $sum: { $cond: [{ $in: ['$status', ['paid', 'completed']] }, 1, 0] },
            },
          },
        },
      ]),
      SettlementModel.aggregate([
        {
          $group: {
            _id: null,
            unsettledAmount: {
              $sum: { $cond: [{ $eq: ['$status', 'unsettled'] }, '$netSettlementAmount', 0] },
            },
          },
        },
      ]),
      TransactionModel.aggregate([
        {
          $group: {
            _id: null,
            reconciledTransactionsCount: {
              $sum: { $cond: [{ $eq: ['$reconciled', true] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const p = paymentsStats[0] || {};
    const po = payoutsStats[0] || {};
    const s = settlementsStats[0] || {};
    const t = transactionsStats[0] || {};

    return {
      totalPayments: p.totalPayments || 0,
      successfulPaymentsCount: p.successfulPaymentsCount || 0,
      failedPaymentsCount: p.failedPaymentsCount || 0,
      refundedPaymentsCount: p.refundedPaymentsCount || 0,
      totalVolumeAmount: p.totalVolumeAmount || 0,
      pendingPayoutsCount: po.pendingPayoutsCount || 0,
      completedPayoutsCount: po.completedPayoutsCount || 0,
      unsettledAmount: s.unsettledAmount || 0,
      reconciledTransactionsCount: t.reconciledTransactionsCount || 0,
    };
  }
}

export const paymentsRepository = new PaymentsRepository();
