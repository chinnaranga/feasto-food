import { paymentsRepository } from './payments.repository.js';
import {
  generatePaymentId,
  generateTransactionId,
  generateWalletId,
  generateWalletEntryId,
  generatePayoutId,
  generateRefundId,
  generateSettlementId,
  generateEventId,
  generateActivityId,
  calculateSettlementBreakdown,
} from './payments.utils.js';
import {
  IPayment,
  ITransaction,
  IWallet,
  IWalletEntry,
  IPayout,
  IRefund,
  ISettlement,
  IFinancialSummary,
} from './payments.types.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';

export class PaymentsService {
  // 1. PAYMENT INITIALIZATION
  async initializePayment(data: {
    orderId: string;
    customerId: string;
    restaurantId: string;
    riderId?: string;
    amount: number;
    currency?: string;
    gateway?: any;
    paymentMethod?: any;
  }): Promise<IPayment> {
    const existing = await paymentsRepository.findPaymentByOrderId(data.orderId);
    if (existing && ['captured', 'authorized'].includes(existing.paymentStatus)) {
      throw new ConflictError(`Payment already initialized/captured for order ${data.orderId}`);
    }

    const paymentId = generatePaymentId();
    const currency = data.currency || 'INR';

    const netAmount = data.amount;
    const taxAmount = Math.round((data.amount * 5) / 100);
    const feeAmount = Math.round((data.amount * 2) / 100);

    const payment = await paymentsRepository.createPayment({
      paymentId,
      orderId: data.orderId,
      customerId: data.customerId,
      restaurantId: data.restaurantId,
      riderId: data.riderId,
      gateway: data.gateway || 'razorpay',
      paymentMethod: data.paymentMethod || 'card',
      paymentStatus: 'pending',
      captureStatus: 'not_captured',
      refundStatus: 'none',
      amount: data.amount,
      currency,
      taxAmount,
      feeAmount,
      netAmount,
      paymentIntentStatus: 'created',
      payoutStatus: 'unpaid',
      settlementStatus: 'unsettled',
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId: data.customerId,
      actorRole: 'customer',
      action: 'PAYMENT_INITIALIZED',
      entityType: 'payment',
      entityId: paymentId,
      details: { orderId: data.orderId, amount: data.amount, gateway: data.gateway },
    });

    return payment;
  }

  // 2. PAYMENT CONFIRMATION
  async confirmPayment(
    paymentId: string,
    data: {
      gatewayPaymentId?: string;
      gatewayOrderId?: string;
      status?: 'captured' | 'failed' | 'cancelled';
      failureReason?: string;
      actorId?: string;
    }
  ): Promise<IPayment> {
    const payment = await paymentsRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new NotFoundError(`Payment ${paymentId} not found`);
    }

    if (payment.paymentStatus === 'captured') {
      return payment; // Duplicate protection
    }

    const status = data.status || 'captured';
    const now = new Date();

    const updatedPayment = await paymentsRepository.updatePayment(paymentId, {
      paymentStatus: status,
      captureStatus: status === 'captured' ? 'captured' : 'failed',
      gatewayPaymentId: data.gatewayPaymentId || payment.gatewayPaymentId || `gtw_pay_${Date.now()}`,
      gatewayOrderId: data.gatewayOrderId || payment.gatewayOrderId || `gtw_ord_${Date.now()}`,
      capturedAt: status === 'captured' ? now : undefined,
    });

    if (!updatedPayment) {
      throw new NotFoundError(`Payment ${paymentId} could not be updated`);
    }

    if (status === 'captured') {
      // Record immutable ledger entry
      const transactionId = generateTransactionId();
      await paymentsRepository.createTransaction({
        transactionId,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        customerId: payment.customerId,
        restaurantId: payment.restaurantId,
        riderId: payment.riderId,
        type: 'credit',
        status: 'completed',
        amount: payment.amount,
        currency: payment.currency,
        description: `Order payment captured for ${payment.orderId}`,
        reconciled: false,
      });

      await paymentsRepository.updatePayment(paymentId, { transactionId });

      // Create settlement record for restaurant
      const settlementBreakdown = calculateSettlementBreakdown(payment.amount);
      await paymentsRepository.createSettlement({
        settlementId: generateSettlementId(),
        restaurantId: payment.restaurantId,
        riderId: payment.riderId,
        orderId: payment.orderId,
        ...settlementBreakdown,
        status: 'unsettled',
        reconciled: false,
      });

      // Also ensure customer, restaurant, and rider wallets exist
      await this.getOrCreateWallet(payment.customerId, 'customer');
      await this.getOrCreateWallet(payment.restaurantId, 'restaurant');
      if (payment.riderId) {
        await this.getOrCreateWallet(payment.riderId, 'rider');
      }
    }

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId: data.actorId || payment.customerId,
      actorRole: 'system',
      action: `PAYMENT_${status.toUpperCase()}`,
      entityType: 'payment',
      entityId: paymentId,
      details: { status, gatewayPaymentId: data.gatewayPaymentId },
    });

    return updatedPayment;
  }

  async cancelPayment(paymentId: string, actorId: string, reason?: string): Promise<IPayment> {
    const payment = await paymentsRepository.findPaymentById(paymentId);
    if (!payment) throw new NotFoundError(`Payment ${paymentId} not found`);

    if (['captured', 'refunded'].includes(payment.paymentStatus)) {
      throw new BadRequestError(`Cannot cancel payment in status ${payment.paymentStatus}`);
    }

    const updated = await paymentsRepository.updatePayment(paymentId, {
      paymentStatus: 'cancelled',
      captureStatus: 'failed',
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'user',
      action: 'PAYMENT_CANCELLED',
      entityType: 'payment',
      entityId: paymentId,
      details: { reason },
    });

    return updated!;
  }

  async getPaymentById(paymentId: string): Promise<IPayment> {
    const payment = await paymentsRepository.findPaymentById(paymentId);
    if (!payment) throw new NotFoundError(`Payment ${paymentId} not found`);
    return payment;
  }

  async getPayments(query: Record<string, any>, limit = 50, skip = 0): Promise<IPayment[]> {
    return paymentsRepository.findPayments(query, limit, skip);
  }

  // 3. TRANSACTIONS
  async getTransactions(query: Record<string, any>, limit = 50, skip = 0): Promise<ITransaction[]> {
    return paymentsRepository.findTransactions(query, limit, skip);
  }

  async getTransactionById(transactionId: string): Promise<ITransaction> {
    const txn = await paymentsRepository.findTransactionById(transactionId);
    if (!txn) throw new NotFoundError(`Transaction ${transactionId} not found`);
    return txn;
  }

  async reconcileTransaction(transactionId: string, actorId: string): Promise<ITransaction> {
    const txn = await paymentsRepository.findTransactionById(transactionId);
    if (!txn) throw new NotFoundError(`Transaction ${transactionId} not found`);

    const updated = await paymentsRepository.updateTransaction(transactionId, {
      reconciled: true,
      reconciledAt: new Date(),
      status: 'reconciled',
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'TRANSACTION_RECONCILED',
      entityType: 'transaction',
      entityId: transactionId,
      details: { previousStatus: txn.status },
    });

    return updated!;
  }

  // 4. WALLET MANAGEMENT
  async getOrCreateWallet(ownerId: string, ownerType: 'customer' | 'restaurant' | 'rider'): Promise<IWallet> {
    let wallet = await paymentsRepository.findWalletByOwner(ownerId, ownerType);
    if (!wallet) {
      const walletId = generateWalletId();
      wallet = await paymentsRepository.createWallet({
        walletId,
        ownerId,
        ownerType,
        balance: 0,
        pendingBalance: 0,
        lockedBalance: 0,
        currency: 'INR',
        status: 'active',
      });

      await paymentsRepository.logFinancialActivity({
        activityId: generateActivityId(),
        actorId: ownerId,
        actorRole: ownerType,
        action: 'WALLET_CREATED',
        entityType: 'wallet',
        entityId: walletId,
      });
    }
    return wallet;
  }

  async getWalletById(walletId: string): Promise<IWallet> {
    const wallet = await paymentsRepository.findWalletById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
    return wallet;
  }

  async getWallets(query: Record<string, any>, limit = 50, skip = 0): Promise<IWallet[]> {
    return paymentsRepository.findWallets(query, limit, skip);
  }

  async updateWallet(walletId: string, updateData: Partial<IWallet>, actorId: string): Promise<IWallet> {
    const wallet = await paymentsRepository.findWalletById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);

    const updated = await paymentsRepository.updateWallet(walletId, updateData);

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'WALLET_UPDATED',
      entityType: 'wallet',
      entityId: walletId,
      details: updateData,
    });

    return updated!;
  }

  async creditWallet(
    walletId: string,
    amount: number,
    referenceType: 'order' | 'payout' | 'refund' | 'adjustment',
    referenceId: string,
    description: string,
    actorId: string
  ): Promise<IWallet> {
    const wallet = await paymentsRepository.findWalletById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);

    if (wallet.status !== 'active') {
      throw new BadRequestError(`Wallet ${walletId} is not active (${wallet.status})`);
    }

    const previousBalance = wallet.balance;
    const newBalance = previousBalance + amount;

    const updatedWallet = await paymentsRepository.updateWalletBalance(walletId, amount, 0);

    const entryId = generateWalletEntryId();
    await paymentsRepository.createWalletEntry({
      entryId,
      walletId,
      type: 'credit',
      amount,
      previousBalance,
      newBalance,
      referenceType,
      referenceId,
      description,
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'system',
      action: 'WALLET_CREDITED',
      entityType: 'wallet',
      entityId: walletId,
      details: { amount, previousBalance, newBalance, referenceId },
    });

    return updatedWallet!;
  }

  async debitWallet(
    walletId: string,
    amount: number,
    referenceType: 'order' | 'payout' | 'refund' | 'adjustment',
    referenceId: string,
    description: string,
    actorId: string
  ): Promise<IWallet> {
    const wallet = await paymentsRepository.findWalletById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);

    if (wallet.status !== 'active') {
      throw new BadRequestError(`Wallet ${walletId} is not active (${wallet.status})`);
    }

    if (wallet.balance < amount) {
      throw new BadRequestError(`Insufficient wallet balance. Available: ₹${wallet.balance}, requested: ₹${amount}`);
    }

    const previousBalance = wallet.balance;
    const newBalance = previousBalance - amount;

    const updatedWallet = await paymentsRepository.updateWalletBalance(walletId, -amount, 0);

    const entryId = generateWalletEntryId();
    await paymentsRepository.createWalletEntry({
      entryId,
      walletId,
      type: 'debit',
      amount,
      previousBalance,
      newBalance,
      referenceType,
      referenceId,
      description,
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'system',
      action: 'WALLET_DEBITED',
      entityType: 'wallet',
      entityId: walletId,
      details: { amount, previousBalance, newBalance, referenceId },
    });

    return updatedWallet!;
  }

  async getWalletHistory(walletId: string, limit = 50, skip = 0): Promise<IWalletEntry[]> {
    const wallet = await paymentsRepository.findWalletById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
    return paymentsRepository.findWalletEntries(walletId, limit, skip);
  }

  // 5. PAYOUT MANAGEMENT
  async createPayout(data: {
    recipientId: string;
    recipientType: 'restaurant' | 'rider';
    amount: number;
    payoutMethod?: any;
    currency?: string;
    actorId: string;
  }): Promise<IPayout> {
    const wallet = await this.getOrCreateWallet(data.recipientId, data.recipientType);

    if (wallet.balance < data.amount) {
      throw new BadRequestError(
        `Recipient wallet balance (₹${wallet.balance}) is lower than payout amount (₹${data.amount})`
      );
    }

    const payoutId = generatePayoutId();

    const payout = await paymentsRepository.createPayout({
      payoutId,
      recipientId: data.recipientId,
      recipientType: data.recipientType,
      walletId: wallet.walletId,
      amount: data.amount,
      currency: data.currency || 'INR',
      status: 'initiated',
      payoutMethod: data.payoutMethod || 'bank_transfer',
      gatewayPayoutId: `gtw_po_${Date.now()}`,
    });

    // Debit wallet to hold payout funds
    await this.debitWallet(
      wallet.walletId,
      data.amount,
      'payout',
      payoutId,
      `Payout request initiated for ${data.recipientType} ${data.recipientId}`,
      data.actorId
    );

    // Auto process to pending/completed in workflow
    await paymentsRepository.updatePayout(payoutId, {
      status: 'completed',
      processedAt: new Date(),
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId: data.actorId,
      actorRole: 'user',
      action: 'PAYOUT_INITIATED',
      entityType: 'payout',
      entityId: payoutId,
      details: { recipientId: data.recipientId, amount: data.amount },
    });

    return (await paymentsRepository.findPayoutById(payoutId))!;
  }

  async getPayouts(query: Record<string, any>, limit = 50, skip = 0): Promise<IPayout[]> {
    return paymentsRepository.findPayouts(query, limit, skip);
  }

  async getPayoutById(payoutId: string): Promise<IPayout> {
    const payout = await paymentsRepository.findPayoutById(payoutId);
    if (!payout) throw new NotFoundError(`Payout ${payoutId} not found`);
    return payout;
  }

  async updatePayout(payoutId: string, updateData: Partial<IPayout>, actorId: string): Promise<IPayout> {
    const payout = await paymentsRepository.findPayoutById(payoutId);
    if (!payout) throw new NotFoundError(`Payout ${payoutId} not found`);

    const updated = await paymentsRepository.updatePayout(payoutId, updateData);

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'PAYOUT_UPDATED',
      entityType: 'payout',
      entityId: payoutId,
      details: updateData,
    });

    return updated!;
  }

  async retryPayout(payoutId: string, actorId: string): Promise<IPayout> {
    const payout = await paymentsRepository.findPayoutById(payoutId);
    if (!payout) throw new NotFoundError(`Payout ${payoutId} not found`);

    if (payout.status !== 'failed') {
      throw new BadRequestError(`Can only retry payouts with status 'failed', current: ${payout.status}`);
    }

    const updated = await paymentsRepository.updatePayout(payoutId, {
      status: 'pending',
      processedAt: new Date(),
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'PAYOUT_RETRIED',
      entityType: 'payout',
      entityId: payoutId,
    });

    return updated!;
  }

  async cancelPayout(payoutId: string, actorId: string): Promise<IPayout> {
    const payout = await paymentsRepository.findPayoutById(payoutId);
    if (!payout) throw new NotFoundError(`Payout ${payoutId} not found`);

    if (['completed', 'paid'].includes(payout.status)) {
      throw new BadRequestError(`Cannot cancel payout in completed status`);
    }

    const updated = await paymentsRepository.updatePayout(payoutId, {
      status: 'cancelled',
    });

    // Refund funds back to wallet
    if (payout.walletId) {
      await this.creditWallet(
        payout.walletId,
        payout.amount,
        'payout',
        payoutId,
        `Reversal of cancelled payout ${payoutId}`,
        actorId
      );
    }

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'user',
      action: 'PAYOUT_CANCELLED',
      entityType: 'payout',
      entityId: payoutId,
    });

    return updated!;
  }

  // 6. REFUND MANAGEMENT
  async initiateRefund(data: {
    paymentId: string;
    amount: number;
    reason: string;
    actorId: string;
  }): Promise<IRefund> {
    const payment = await paymentsRepository.findPaymentById(data.paymentId);
    if (!payment) throw new NotFoundError(`Payment ${data.paymentId} not found`);

    if (payment.paymentStatus !== 'captured') {
      throw new BadRequestError(`Can only refund captured payments. Current status: ${payment.paymentStatus}`);
    }

    if (data.amount > payment.amount) {
      throw new BadRequestError(`Refund amount ₹${data.amount} exceeds payment amount ₹${payment.amount}`);
    }

    const refundId = generateRefundId();

    const refund = await paymentsRepository.createRefund({
      refundId,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      customerId: payment.customerId,
      amount: data.amount,
      currency: payment.currency,
      status: 'completed',
      reason: data.reason,
      approvedBy: data.actorId,
      gatewayRefundId: `gtw_ref_${Date.now()}`,
      processedAt: new Date(),
    });

    const isFullRefund = data.amount >= payment.amount;

    await paymentsRepository.updatePayment(payment.paymentId, {
      paymentStatus: isFullRefund ? 'refunded' : 'partially_refunded',
      refundStatus: isFullRefund ? 'full' : 'partial',
      refundedAt: new Date(),
    });

    // Record refund transaction ledger
    await paymentsRepository.createTransaction({
      transactionId: generateTransactionId(),
      paymentId: payment.paymentId,
      orderId: payment.orderId,
      customerId: payment.customerId,
      restaurantId: payment.restaurantId,
      type: 'refund',
      status: 'completed',
      amount: data.amount,
      currency: payment.currency,
      description: `Refund processed for order ${payment.orderId}: ${data.reason}`,
      reconciled: false,
    });

    // Credit customer wallet if refund is via wallet
    const customerWallet = await this.getOrCreateWallet(payment.customerId, 'customer');
    await this.creditWallet(
      customerWallet.walletId,
      data.amount,
      'refund',
      refundId,
      `Refund credited for order ${payment.orderId}`,
      data.actorId
    );

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId: data.actorId,
      actorRole: 'user',
      action: 'REFUND_COMPLETED',
      entityType: 'refund',
      entityId: refundId,
      details: { amount: data.amount, reason: data.reason },
    });

    return refund;
  }

  async getRefunds(query: Record<string, any>, limit = 50, skip = 0): Promise<IRefund[]> {
    return paymentsRepository.findRefunds(query, limit, skip);
  }

  async getRefundById(refundId: string): Promise<IRefund> {
    const refund = await paymentsRepository.findRefundById(refundId);
    if (!refund) throw new NotFoundError(`Refund ${refundId} not found`);
    return refund;
  }

  async updateRefund(refundId: string, updateData: Partial<IRefund>, actorId: string): Promise<IRefund> {
    const refund = await paymentsRepository.findRefundById(refundId);
    if (!refund) throw new NotFoundError(`Refund ${refundId} not found`);

    const updated = await paymentsRepository.updateRefund(refundId, updateData);

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'REFUND_UPDATED',
      entityType: 'refund',
      entityId: refundId,
      details: updateData,
    });

    return updated!;
  }

  async approveRefund(refundId: string, actorId: string): Promise<IRefund> {
    const refund = await paymentsRepository.findRefundById(refundId);
    if (!refund) throw new NotFoundError(`Refund ${refundId} not found`);

    const updated = await paymentsRepository.updateRefund(refundId, {
      status: 'approved',
      approvedBy: actorId,
      processedAt: new Date(),
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'REFUND_APPROVED',
      entityType: 'refund',
      entityId: refundId,
    });

    return updated!;
  }

  async rejectRefund(refundId: string, actorId: string, reason?: string): Promise<IRefund> {
    const refund = await paymentsRepository.findRefundById(refundId);
    if (!refund) throw new NotFoundError(`Refund ${refundId} not found`);

    const updated = await paymentsRepository.updateRefund(refundId, {
      status: 'rejected',
    });

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'REFUND_REJECTED',
      entityType: 'refund',
      entityId: refundId,
      details: { reason },
    });

    return updated!;
  }

  // 7. SETTLEMENT MANAGEMENT
  async getSettlements(query: Record<string, any>, limit = 50, skip = 0): Promise<ISettlement[]> {
    return paymentsRepository.findSettlements(query, limit, skip);
  }

  async getSettlementById(settlementId: string): Promise<ISettlement> {
    const stl = await paymentsRepository.findSettlementById(settlementId);
    if (!stl) throw new NotFoundError(`Settlement ${settlementId} not found`);
    return stl;
  }

  async reconcileSettlement(settlementId: string, actorId: string): Promise<ISettlement> {
    const stl = await paymentsRepository.findSettlementById(settlementId);
    if (!stl) throw new NotFoundError(`Settlement ${settlementId} not found`);

    const updated = await paymentsRepository.updateSettlement(settlementId, {
      status: 'settled',
      reconciled: true,
      settledAt: new Date(),
    });

    // Credit net amount to restaurant wallet
    const restaurantWallet = await this.getOrCreateWallet(stl.restaurantId, 'restaurant');
    await this.creditWallet(
      restaurantWallet.walletId,
      stl.netSettlementAmount,
      'order',
      stl.orderId,
      `Net settlement for order ${stl.orderId}`,
      actorId
    );

    await paymentsRepository.logFinancialActivity({
      activityId: generateActivityId(),
      actorId,
      actorRole: 'admin',
      action: 'SETTLEMENT_RECONCILED',
      entityType: 'settlement',
      entityId: settlementId,
      details: { netSettlementAmount: stl.netSettlementAmount },
    });

    return updated!;
  }

  // 8. WEBHOOK HANDLING
  async processPaymentWebhook(payload: Record<string, any>, signature?: string): Promise<{ received: boolean; eventId: string }> {
    const eventId = payload.id || payload.eventId || generateEventId();
    const existing = await paymentsRepository.findGatewayEventById(eventId);

    if (existing) {
      return { received: true, eventId }; // Idempotency check
    }

    await paymentsRepository.createGatewayEvent({
      eventId,
      gateway: payload.gateway || 'razorpay',
      eventType: payload.event || 'payment.captured',
      payload,
      signature,
      processed: true,
      processedAt: new Date(),
    });

    // Process event if payment confirmation payload
    if (payload.event === 'payment.captured' && payload.data?.paymentId) {
      await this.confirmPayment(payload.data.paymentId, {
        gatewayPaymentId: payload.data.gatewayPaymentId,
        status: 'captured',
      });
    }

    return { received: true, eventId };
  }

  async processPayoutWebhook(payload: Record<string, any>, signature?: string): Promise<{ received: boolean; eventId: string }> {
    const eventId = payload.id || payload.eventId || generateEventId();
    const existing = await paymentsRepository.findGatewayEventById(eventId);

    if (existing) {
      return { received: true, eventId };
    }

    await paymentsRepository.createGatewayEvent({
      eventId,
      gateway: payload.gateway || 'razorpay_payouts',
      eventType: payload.event || 'payout.processed',
      payload,
      signature,
      processed: true,
      processedAt: new Date(),
    });

    return { received: true, eventId };
  }

  // 9. FINANCIAL SUMMARY
  async getFinancialSummary(): Promise<IFinancialSummary> {
    const stats = await paymentsRepository.getFinancialSummary();
    const wallets = await paymentsRepository.findWallets({}, 1000, 0);
    const totalWalletBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

    return {
      ...stats,
      totalWalletBalance,
    };
  }
}

export const paymentsService = new PaymentsService();
