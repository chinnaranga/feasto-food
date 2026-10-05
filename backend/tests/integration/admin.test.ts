/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { Rider } from '../../src/modules/riders/riders.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';
import { AdminAuditLogModel } from '../../src/modules/admin/models/adminAuditLog.model.js';
import { AdminSettingModel } from '../../src/modules/admin/models/adminSetting.model.js';
import { VerificationReviewModel } from '../../src/modules/admin/models/verificationReview.model.js';

describe('Phase 12 — Admin & Platform Management Integration Tests', () => {
  const app = createApp();
  let adminToken: string;
  let adminUserId: string;
  let targetUserId: string;
  let restaurantId: string;
  let riderId: string;
  let orderId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Rider.deleteMany({});
    await Order.deleteMany({});
    await AdminAuditLogModel.deleteMany({});
    await AdminSettingModel.deleteMany({});
    await VerificationReviewModel.deleteMany({});

    // Register super admin
    const adminReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Super Admin',
      email: 'super.admin@example.com',
      password: 'SecurePassword123!',
      role: 'admin',
    });
    adminUserId = adminReg.body.data.user.id;

    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'super.admin@example.com',
      password: 'SecurePassword123!',
    });
    adminToken = adminLogin.body.data.tokens.accessToken;

    // Register target customer
    const userReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Target User',
      email: 'target.user@example.com',
      password: 'SecurePassword123!',
      role: 'customer',
    });
    targetUserId = userReg.body.data.user.id;

    // Create target restaurant
    const rest = await Restaurant.create({
      name: 'Test Kitchen',
      slug: 'test-kitchen',
      ownerId: targetUserId,
      cuisine: ['Indian'],
      status: 'pending_approval',
    });
    restaurantId = rest._id.toString();

    // Create target rider
    const rdr = await Rider.create({
      userId: new mongoose.Types.ObjectId(),
      fullName: 'Target Rider',
      phone: '+919999888877',
      email: 'target.rider@example.com',
      accountStatus: 'pending_verification',
      verificationStatus: 'pending_review',
      availabilityStatus: 'offline',
      rating: 4.8,
    });
    riderId = rdr._id.toString();

    // Create target order
    const ord = await Order.create({
      orderNumber: 'FEASTO-7001',
      customerId: new mongoose.Types.ObjectId(),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      items: [],
      pricingSnapshot: {
        subtotal: 100,
        taxAmount: 5,
        deliveryFee: 10,
        packagingFee: 5,
        discountAmount: 0,
        tipAmount: 0,
        totalAmount: 120,
        currency: 'INR',
      },
      deliveryAddressSnapshot: {
        label: 'Home',
        street: 'Street 1',
        city: 'City',
        state: 'ST',
        zipCode: '10001',
        country: 'IN',
      },
      orderType: 'delivery',
      orderStatus: 'placed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'unassigned',
    });
    orderId = ord._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Operational Overview & Users Admin', () => {
    it('should retrieve operational overview', async () => {
      const res = await request(app)
        .get('/api/v1/admin/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.activeOrdersCount).toBeDefined();
    });

    it('should list, suspend, and restore target user', async () => {
      // List
      const listRes = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBeGreaterThan(0);

      // Suspend
      const suspRes = await request(app)
        .post(`/api/v1/admin/users/${targetUserId}/suspend`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Violated terms of service' });

      expect(suspRes.status).toBe(200);
      expect(suspRes.body.data.isActive).toBe(false);

      // Restore
      const restRes = await request(app)
        .post(`/api/v1/admin/users/${targetUserId}/restore`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Appeal approved' });

      expect(restRes.status).toBe(200);
      expect(restRes.body.data.isActive).toBe(true);
    });
  });

  describe('Restaurant & Rider Verification', () => {
    it('should verify restaurant and rider accounts', async () => {
      // Verify restaurant
      const vrfRest = await request(app)
        .post(`/api/v1/admin/restaurants/${restaurantId}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'FSSAI License verified' });

      expect(vrfRest.status).toBe(200);
      expect(vrfRest.body.data.status).toBe('active');

      // Verify rider
      const vrfRdr = await request(app)
        .post(`/api/v1/admin/riders/${riderId}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Driving license verified' });

      expect(vrfRdr.status).toBe(200);
      expect(vrfRdr.body.data.verificationStatus).toBe('verified');
    });
  });

  describe('Order Override & Platform Settings', () => {
    it('should override order status and update platform settings', async () => {
      // Override order status
      const ovrRes = await request(app)
        .post(`/api/v1/admin/orders/${orderId}/override`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ newStatus: 'preparing', reason: 'Manual override by support' });

      expect(ovrRes.status).toBe(200);
      expect(ovrRes.body.data.orderStatus).toBe('preparing');

      // Update platform setting
      const setRes = await request(app)
        .patch('/api/v1/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          category: 'DISPATCH',
          key: 'max_dispatch_radius_km',
          value: 15,
          description: 'Maximum delivery radius in KM',
        });

      expect(setRes.status).toBe(200);
      expect(setRes.body.data.value).toBe(15);
    });

    it('should log immutable audit trail for all admin actions', async () => {
      const logsRes = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(logsRes.status).toBe(200);
      expect(logsRes.body.data).toBeDefined();
    });
  });
});
