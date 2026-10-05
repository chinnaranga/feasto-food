/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';
import { Rider } from '../../src/modules/riders/riders.model.js';
import { DispatchJobModel } from '../../src/modules/dispatch/models/dispatchJob.model.js';
import { DeliveryOfferModel } from '../../src/modules/dispatch/models/deliveryOffer.model.js';
import { DeliveryAssignmentModel } from '../../src/modules/dispatch/models/deliveryAssignment.model.js';

describe('Phase 11 — Rider Dispatch, Assignment & Allocation Engine Integration Tests', () => {
  const app = createApp();
  let adminToken: string;
  let riderToken: string;
  let riderUserId: string;
  let restaurantId: string;
  let orderId: string;
  let offerId: string;
  let assignmentId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
    await Rider.deleteMany({});
    await DispatchJobModel.deleteMany({});
    await DeliveryOfferModel.deleteMany({});
    await DeliveryAssignmentModel.deleteMany({});

    // Register admin
    const adminReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin Dispatcher',
      email: 'admin.dispatch@example.com',
      password: 'SecurePassword123!',
      role: 'admin',
    });
    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'admin.dispatch@example.com',
      password: 'SecurePassword123!',
    });
    adminToken = adminLogin.body.data.tokens.accessToken;

    // Register rider
    const riderReg = await request(app).post('/api/v1/auth/register').send({
      name: 'Fast Rider',
      email: 'fast.rider@example.com',
      password: 'SecurePassword123!',
      role: 'rider',
    });
    riderUserId = riderReg.body.data.user.id;

    const riderLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'fast.rider@example.com',
      password: 'SecurePassword123!',
    });
    riderToken = riderLogin.body.data.tokens.accessToken;

    // Create Rider record in DB with location
    await Rider.create({
      userId: riderUserId,
      fullName: 'Fast Rider',
      phone: '+919876543210',
      email: 'fast.rider@example.com',
      accountStatus: 'active',
      verificationStatus: 'verified',
      availabilityStatus: 'online',
      lastKnownLocation: {
        type: 'Point',
        coordinates: [77.5946, 12.9716], // [longitude, latitude]
      },
      lastActiveAt: new Date(),
      rating: 4.9,
    });

    // Create Restaurant
    const rest = await Restaurant.create({
      name: 'Curry House',
      slug: 'curry-house',
      ownerId: new mongoose.Types.ObjectId().toString(),
      cuisine: ['Indian'],
      address: {
        street: '200 Curry Rd',
        city: 'Bengaluru',
        state: 'KA',
        zipCode: '560001',
        location: { type: 'Point', coordinates: [77.595, 12.972] },
      },
      status: 'active',
    });
    restaurantId = rest._id.toString();

    // Create Order
    const orderDoc = await Order.create({
      orderNumber: 'FEASTO-9001',
      customerId: new mongoose.Types.ObjectId(),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      items: [],
      pricingSnapshot: {
        subtotal: 500,
        taxAmount: 25,
        deliveryFee: 40,
        packagingFee: 10,
        discountAmount: 0,
        tipAmount: 0,
        totalAmount: 575,
        currency: 'INR',
      },
      deliveryAddressSnapshot: {
        label: 'Office',
        street: 'MG Road',
        city: 'Bengaluru',
        state: 'KA',
        zipCode: '560001',
        country: 'IN',
      },
      orderType: 'delivery',
      orderStatus: 'ready',
      paymentStatus: 'paid',
      fulfillmentStatus: 'unassigned',
    });
    orderId = orderDoc._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Dispatch Execution & Offers Lifecycle', () => {
    it('should execute dispatch and generate delivery offer for eligible rider', async () => {
      // 1. Trigger Dispatch
      const dispRes = await request(app)
        .post(`/api/v1/dispatch/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(dispRes.status).toBe(200);
      expect(dispRes.body.data.success).toBe(true);
      offerId = dispRes.body.data.offerId;

      // 2. Fetch rider offers
      const offersRes = await request(app)
        .get('/api/v1/rider/offers')
        .set('Authorization', `Bearer ${riderToken}`);

      expect(offersRes.status).toBe(200);
      expect(offersRes.body.data.length).toBe(1);

      // 3. Accept Offer
      const acceptRes = await request(app)
        .post(`/api/v1/rider/offers/${offerId}/accept`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.data.assignmentStatus).toBe('ACCEPTED');
      assignmentId = acceptRes.body.data.assignmentId;

      // 4. Progress delivery lifecycle
      const startPick = await request(app)
        .post(`/api/v1/rider/assignments/${assignmentId}/start-pickup`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(startPick.status).toBe(200);
      expect(startPick.body.data.assignmentStatus).toBe('PICKUP_PENDING');

      const confPick = await request(app)
        .post(`/api/v1/rider/assignments/${assignmentId}/confirm-pickup`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(confPick.status).toBe(200);
      expect(confPick.body.data.assignmentStatus).toBe('PICKED_UP');

      const complete = await request(app)
        .post(`/api/v1/rider/assignments/${assignmentId}/complete`)
        .set('Authorization', `Bearer ${riderToken}`);

      expect(complete.status).toBe(200);
      expect(complete.body.data.assignmentStatus).toBe('COMPLETED');
    });

    it('should handle offer rejection and operational reassignment', async () => {
      // Trigger dispatch
      const dispRes = await request(app)
        .post(`/api/v1/dispatch/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      const oId = dispRes.body.data.offerId;

      // Reject offer
      const rejRes = await request(app)
        .post(`/api/v1/rider/offers/${oId}/reject`)
        .set('Authorization', `Bearer ${riderToken}`)
        .send({ reason: 'TOO_FAR' });

      expect(rejRes.status).toBe(200);

      // Operational Reassign by Admin
      const reassignRes = await request(app)
        .post(`/api/v1/dispatch/orders/${orderId}/reassign`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(reassignRes.status).toBe(200);
    });

    it('should read and update dispatch configuration', async () => {
      const getCfg = await request(app)
        .get('/api/v1/dispatch/config')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getCfg.status).toBe(200);
      expect(getCfg.body.data.maxDispatchRadiusKm).toBeDefined();

      const patchCfg = await request(app)
        .patch('/api/v1/dispatch/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ maxDispatchRadiusKm: 12, offerTimeoutSeconds: 60 });

      expect(patchCfg.status).toBe(200);
      expect(patchCfg.body.data.maxDispatchRadiusKm).toBe(12);
      expect(patchCfg.body.data.offerTimeoutSeconds).toBe(60);
    });
  });
});
