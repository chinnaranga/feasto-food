/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { PaymentModel } from '../../src/modules/payments/models/payments.model.js';
import { TransactionModel } from '../../src/modules/payments/models/transaction.model.js';
import { WalletModel } from '../../src/modules/payments/models/wallet.model.js';
import { WalletEntryModel } from '../../src/modules/payments/models/walletEntry.model.js';
import { PayoutModel } from '../../src/modules/payments/models/payout.model.js';
import { RefundModel } from '../../src/modules/payments/models/refund.model.js';
import { SettlementModel } from '../../src/modules/payments/models/settlement.model.js';

describe('Phase 8 — Payments, Wallet, Payouts & Transaction Integration Tests', () => {
  const app = createApp();
  let customerToken: string;
  let adminToken: string;
  let customerId: string;
  let adminId: string;
  let paymentId: string;
  let walletId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await PaymentModel.deleteMany({});
    await TransactionModel.deleteMany({});
    await WalletModel.deleteMany({});
    await WalletEntryModel.deleteMany({});
    await PayoutModel.deleteMany({});
    await RefundModel.deleteMany({});
    await SettlementModel.deleteMany({});

    // Register customer
    const custReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Charlie Customer',
      email: 'charlie.pay@example.com',
      password: 'SecurePassword123!',
      role: 'customer',
    });
    customerId = custReg.body.data.user.id;

    const custLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'charlie.pay@example.com',
      password: 'SecurePassword123!',
    });
    customerToken = custLogin.body.data.tokens.accessToken;

    // Register admin
    const adminReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin PayManager',
      email: 'admin.pay@example.com',
      password: 'SecurePassword123!',
      role: 'admin',
    });
    adminId = adminReg.body.data.user.id;

    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'admin.pay@example.com',
      password: 'SecurePassword123!',
    });
    adminToken = adminLogin.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Payment Lifecycle', () => {
    it('should initialize, confirm, and list payments', async () => {
      // 1. Initialize payment
      const initRes = await request(app)
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: 'ord_test_888',
          customerId,
          restaurantId: 'rest_test_999',
          amount: 1500,
          currency: 'INR',
          gateway: 'razorpay',
          paymentMethod: 'card',
        });

      expect(initRes.status).toBe(201);
      expect(initRes.body.success).toBe(true);
      expect(initRes.body.data.paymentStatus).toBe('pending');
      paymentId = initRes.body.data.paymentId;

      // 2. Confirm payment
      const confirmRes = await request(app)
        .post('/api/v1/payments/confirm')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          paymentId,
          gatewayPaymentId: 'pay_gw_12345',
          status: 'captured',
        });

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.success).toBe(true);
      expect(confirmRes.body.data.paymentStatus).toBe('captured');
      expect(confirmRes.body.data.captureStatus).toBe('captured');

      // 3. Get payment details
      const getRes = await request(app)
        .get(`/api/v1/payments/${paymentId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.paymentId).toBe(paymentId);
    });

    it('should cancel pending payment', async () => {
      const initRes = await request(app)
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: 'ord_cancel_111',
          customerId,
          restaurantId: 'rest_test_999',
          amount: 500,
        });

      const pId = initRes.body.data.paymentId;

      const cancelRes = await request(app)
        .post(`/api/v1/payments/${pId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'User requested cancellation' });

      expect(cancelRes.status).toBe(200);
      expect(cancelRes.body.data.paymentStatus).toBe('cancelled');
    });
  });

  describe('Wallets & Ledger Transactions', () => {
    it('should fetch user wallet, credit it, and debit it', async () => {
      // 1. Get customer wallet
      const walletRes = await request(app)
        .get('/api/v1/wallets')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(walletRes.status).toBe(200);
      expect(walletRes.body.data.length).toBe(1);
      walletId = walletRes.body.data[0].walletId;

      // 2. Admin credit wallet
      const creditRes = await request(app)
        .post(`/api/v1/wallets/${walletId}/credit`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          amount: 2000,
          referenceType: 'adjustment',
          referenceId: 'ref_adj_100',
          description: 'Promotional loyalty deposit',
        });

      expect(creditRes.status).toBe(200);
      expect(creditRes.body.data.balance).toBe(2000);

      // 3. Debit wallet
      const debitRes = await request(app)
        .post(`/api/v1/wallets/${walletId}/debit`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          amount: 500,
          referenceType: 'order',
          referenceId: 'ord_wallet_pay_1',
          description: 'Payment for lunch box',
        });

      expect(debitRes.status).toBe(200);
      expect(debitRes.body.data.balance).toBe(1500);

      // 4. Wallet history
      const historyRes = await request(app)
        .get(`/api/v1/wallets/${walletId}/history`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.data.length).toBe(2);
    });
  });

  describe('Payouts, Refunds & Settlements', () => {
    it('should process refund for captured payment', async () => {
      // Initialize & Confirm payment
      const initRes = await request(app)
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: 'ord_ref_777',
          customerId,
          restaurantId: 'rest_test_999',
          amount: 1000,
        });

      const pId = initRes.body.data.paymentId;

      await request(app)
        .post('/api/v1/payments/confirm')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ paymentId: pId, status: 'captured' });

      // Request refund
      const refundRes = await request(app)
        .post('/api/v1/refunds')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          paymentId: pId,
          amount: 1000,
          reason: 'Food delivered cold and unsealed',
        });

      expect(refundRes.status).toBe(201);
      expect(refundRes.body.data.status).toBe('completed');
      expect(refundRes.body.data.amount).toBe(1000);
    });

    it('should reconcile settlement by admin', async () => {
      const initRes = await request(app)
        .post('/api/v1/payments/initialize')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId: 'ord_stl_555',
          customerId,
          restaurantId: 'rest_test_999',
          amount: 2000,
        });

      await request(app)
        .post('/api/v1/payments/confirm')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ paymentId: initRes.body.data.paymentId, status: 'captured' });

      // Get settlements
      const stlRes = await request(app)
        .get('/api/v1/settlements')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(stlRes.status).toBe(200);
      expect(stlRes.body.data.length).toBeGreaterThan(0);
      const settlementId = stlRes.body.data[0].settlementId;

      // Reconcile settlement
      const recRes = await request(app)
        .post(`/api/v1/settlements/${settlementId}/reconcile`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reconciled: true });

      expect(recRes.status).toBe(200);
      expect(recRes.body.data.status).toBe('settled');
      expect(recRes.body.data.reconciled).toBe(true);
    });

    it('should process webhook events', async () => {
      const webhookRes = await request(app)
        .post('/api/v1/webhooks/payments')
        .send({
          event: 'payment.captured',
          data: { paymentId: 'pay_dummy_123', status: 'captured' },
        });

      expect(webhookRes.status).toBe(200);
      expect(webhookRes.body.success).toBe(true);
    });
  });
});
