import { Request, Response } from 'express';
import { paymentsService } from './payments.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class PaymentsController {
  // PAYMENTS
  async initializePayment(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.initializePayment({
      ...req.body,
      customerId: req.body.customerId || req.user?.id,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Payment initialized successfully',
      data: payment,
      timestamp: new Date().toISOString(),
    });
  }

  async confirmPayment(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.confirmPayment(req.body.paymentId, {
      ...req.body,
      actorId: req.user?.id,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: payment,
      timestamp: new Date().toISOString(),
    });
  }

  async getPayment(req: Request, res: Response): Promise<void> {
    const paymentId = parseParam(req.params.paymentId);
    const payment = await paymentsService.getPaymentById(paymentId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: payment,
      timestamp: new Date().toISOString(),
    });
  }

  async getPayments(req: Request, res: Response): Promise<void> {
    const limit = Number(req.query.limit) || 50;
    const skip = Number(req.query.skip) || 0;
    const filter: Record<string, any> = {};

    if (req.query.orderId) filter.orderId = parseParam(req.query.orderId as string);
    if (req.query.customerId) filter.customerId = parseParam(req.query.customerId as string);
    if (req.query.restaurantId) filter.restaurantId = parseParam(req.query.restaurantId as string);
    if (req.query.status) filter.paymentStatus = parseParam(req.query.status as string);

    // Customer restriction
    if (req.user?.role === 'customer') {
      filter.customerId = req.user.id;
    }

    const payments = await paymentsService.getPayments(filter, limit, skip);
    res.status(HttpStatus.OK).json({
      success: true,
      count: payments.length,
      data: payments,
      timestamp: new Date().toISOString(),
    });
  }

  async cancelPayment(req: Request, res: Response): Promise<void> {
    const paymentId = parseParam(req.params.paymentId);
    const payment = await paymentsService.cancelPayment(paymentId, req.user?.id || '', req.body.reason);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payment cancelled',
      data: payment,
      timestamp: new Date().toISOString(),
    });
  }

  // TRANSACTIONS
  async getTransactions(req: Request, res: Response): Promise<void> {
    const limit = Number(req.query.limit) || 50;
    const skip = Number(req.query.skip) || 0;
    const filter: Record<string, any> = {};

    if (req.user?.role === 'customer') filter.customerId = req.user.id;
    if (req.user?.role === 'restaurant_owner') filter.restaurantId = req.user.id;
    if (req.user?.role === 'rider') filter.riderId = req.user.id;

    const transactions = await paymentsService.getTransactions(filter, limit, skip);
    res.status(HttpStatus.OK).json({
      success: true,
      count: transactions.length,
      data: transactions,
      timestamp: new Date().toISOString(),
    });
  }

  async getTransaction(req: Request, res: Response): Promise<void> {
    const transactionId = parseParam(req.params.transactionId);
    const transaction = await paymentsService.getTransactionById(transactionId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: transaction,
      timestamp: new Date().toISOString(),
    });
  }

  async reconcileTransaction(req: Request, res: Response): Promise<void> {
    const transactionId = parseParam(req.params.transactionId);
    const transaction = await paymentsService.reconcileTransaction(transactionId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Transaction reconciled successfully',
      data: transaction,
      timestamp: new Date().toISOString(),
    });
  }

  // WALLETS
  async getWallets(req: Request, res: Response): Promise<void> {
    const filter: Record<string, any> = {};
    if (req.user?.role !== 'admin') {
      const ownerType = req.user?.role === 'restaurant_owner' ? 'restaurant' : req.user?.role === 'rider' ? 'rider' : 'customer';
      const wallet = await paymentsService.getOrCreateWallet(req.user?.id || '', ownerType);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [wallet],
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const wallets = await paymentsService.getWallets(filter);
    res.status(HttpStatus.OK).json({
      success: true,
      count: wallets.length,
      data: wallets,
      timestamp: new Date().toISOString(),
    });
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    const walletId = parseParam(req.params.walletId);
    const wallet = await paymentsService.getWalletById(walletId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: wallet,
      timestamp: new Date().toISOString(),
    });
  }

  async updateWallet(req: Request, res: Response): Promise<void> {
    const walletId = parseParam(req.params.walletId);
    const wallet = await paymentsService.updateWallet(walletId, req.body, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Wallet updated',
      data: wallet,
      timestamp: new Date().toISOString(),
    });
  }

  async creditWallet(req: Request, res: Response): Promise<void> {
    const walletId = parseParam(req.params.walletId);
    const wallet = await paymentsService.creditWallet(
      walletId,
      req.body.amount,
      req.body.referenceType,
      req.body.referenceId,
      req.body.description,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Wallet credited successfully',
      data: wallet,
      timestamp: new Date().toISOString(),
    });
  }

  async debitWallet(req: Request, res: Response): Promise<void> {
    const walletId = parseParam(req.params.walletId);
    const wallet = await paymentsService.debitWallet(
      walletId,
      req.body.amount,
      req.body.referenceType,
      req.body.referenceId,
      req.body.description,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Wallet debited successfully',
      data: wallet,
      timestamp: new Date().toISOString(),
    });
  }

  async getWalletHistory(req: Request, res: Response): Promise<void> {
    const walletId = parseParam(req.params.walletId);
    const history = await paymentsService.getWalletHistory(walletId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: history.length,
      data: history,
      timestamp: new Date().toISOString(),
    });
  }

  // PAYOUTS
  async createPayout(req: Request, res: Response): Promise<void> {
    const recipientType = req.body.recipientType || (req.user?.role === 'restaurant_owner' ? 'restaurant' : 'rider');
    const recipientId = req.body.recipientId || req.user?.id;

    const payout = await paymentsService.createPayout({
      ...req.body,
      recipientId,
      recipientType,
      actorId: req.user?.id || '',
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Payout requested successfully',
      data: payout,
      timestamp: new Date().toISOString(),
    });
  }

  async getPayouts(req: Request, res: Response): Promise<void> {
    const filter: Record<string, any> = {};
    if (req.user?.role === 'restaurant_owner' || req.user?.role === 'rider') {
      filter.recipientId = req.user.id;
    }
    const payouts = await paymentsService.getPayouts(filter);
    res.status(HttpStatus.OK).json({
      success: true,
      count: payouts.length,
      data: payouts,
      timestamp: new Date().toISOString(),
    });
  }

  async getPayout(req: Request, res: Response): Promise<void> {
    const payoutId = parseParam(req.params.payoutId);
    const payout = await paymentsService.getPayoutById(payoutId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: payout,
      timestamp: new Date().toISOString(),
    });
  }

  async updatePayout(req: Request, res: Response): Promise<void> {
    const payoutId = parseParam(req.params.payoutId);
    const payout = await paymentsService.updatePayout(payoutId, req.body, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payout status updated',
      data: payout,
      timestamp: new Date().toISOString(),
    });
  }

  async retryPayout(req: Request, res: Response): Promise<void> {
    const payoutId = parseParam(req.params.payoutId);
    const payout = await paymentsService.retryPayout(payoutId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payout retried',
      data: payout,
      timestamp: new Date().toISOString(),
    });
  }

  async cancelPayout(req: Request, res: Response): Promise<void> {
    const payoutId = parseParam(req.params.payoutId);
    const payout = await paymentsService.cancelPayout(payoutId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payout cancelled',
      data: payout,
      timestamp: new Date().toISOString(),
    });
  }

  // REFUNDS
  async createRefund(req: Request, res: Response): Promise<void> {
    const refund = await paymentsService.initiateRefund({
      ...req.body,
      actorId: req.user?.id || '',
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Refund initiated and completed',
      data: refund,
      timestamp: new Date().toISOString(),
    });
  }

  async getRefunds(req: Request, res: Response): Promise<void> {
    const filter: Record<string, any> = {};
    if (req.user?.role === 'customer') {
      filter.customerId = req.user.id;
    }
    const refunds = await paymentsService.getRefunds(filter);
    res.status(HttpStatus.OK).json({
      success: true,
      count: refunds.length,
      data: refunds,
      timestamp: new Date().toISOString(),
    });
  }

  async getRefund(req: Request, res: Response): Promise<void> {
    const refundId = parseParam(req.params.refundId);
    const refund = await paymentsService.getRefundById(refundId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: refund,
      timestamp: new Date().toISOString(),
    });
  }

  async updateRefund(req: Request, res: Response): Promise<void> {
    const refundId = parseParam(req.params.refundId);
    const refund = await paymentsService.updateRefund(refundId, req.body, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Refund updated',
      data: refund,
      timestamp: new Date().toISOString(),
    });
  }

  async approveRefund(req: Request, res: Response): Promise<void> {
    const refundId = parseParam(req.params.refundId);
    const refund = await paymentsService.approveRefund(refundId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Refund approved',
      data: refund,
      timestamp: new Date().toISOString(),
    });
  }

  async rejectRefund(req: Request, res: Response): Promise<void> {
    const refundId = parseParam(req.params.refundId);
    const refund = await paymentsService.rejectRefund(refundId, req.user?.id || '', req.body.reason);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Refund rejected',
      data: refund,
      timestamp: new Date().toISOString(),
    });
  }

  // SETTLEMENTS
  async getSettlements(req: Request, res: Response): Promise<void> {
    const filter: Record<string, any> = {};
    if (req.user?.role === 'restaurant_owner') filter.restaurantId = req.user.id;
    if (req.user?.role === 'rider') filter.riderId = req.user.id;

    const settlements = await paymentsService.getSettlements(filter);
    res.status(HttpStatus.OK).json({
      success: true,
      count: settlements.length,
      data: settlements,
      timestamp: new Date().toISOString(),
    });
  }

  async getSettlement(req: Request, res: Response): Promise<void> {
    const settlementId = parseParam(req.params.settlementId);
    const settlement = await paymentsService.getSettlementById(settlementId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: settlement,
      timestamp: new Date().toISOString(),
    });
  }

  async reconcileSettlement(req: Request, res: Response): Promise<void> {
    const settlementId = parseParam(req.params.settlementId);
    const settlement = await paymentsService.reconcileSettlement(settlementId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Settlement reconciled and credited to wallet',
      data: settlement,
      timestamp: new Date().toISOString(),
    });
  }

  // WEBHOOKS
  async handlePaymentWebhook(req: Request, res: Response): Promise<void> {
    const result = await paymentsService.processPaymentWebhook(
      req.body,
      req.headers['x-webhook-signature'] as string
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Webhook processed',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  async handlePayoutWebhook(req: Request, res: Response): Promise<void> {
    const result = await paymentsService.processPayoutWebhook(
      req.body,
      req.headers['x-webhook-signature'] as string
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payout webhook processed',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  // SUMMARY
  async getSummary(_req: Request, res: Response): Promise<void> {
    const summary = await paymentsService.getFinancialSummary();
    res.status(HttpStatus.OK).json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
    });
  }
}

export const paymentsController = new PaymentsController();
