/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';
import { RestaurantOperationsModel } from '../../src/modules/restaurantOperations/restaurantOperations.model.js';
import { KitchenStationModel, KitchenOrderModel, KitchenItemModel } from '../../src/modules/kitchen/kitchen.model.js';
import { PickupHandoverModel } from '../../src/modules/pickup/pickup.model.js';

describe('Phase 10 — Restaurant Operations, Kitchen & Order Fulfillment Integration Tests', () => {
  const app = createApp();
  let ownerToken: string;
  let ownerId: string;
  let restaurantId: string;
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
    await Order.deleteMany({});
    await RestaurantOperationsModel.deleteMany({});
    await KitchenStationModel.deleteMany({});
    await KitchenOrderModel.deleteMany({});
    await KitchenItemModel.deleteMany({});
    await PickupHandoverModel.deleteMany({});

    // Register restaurant owner
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Chef Owner',
      email: 'owner.kitchen@example.com',
      password: 'SecurePassword123!',
      role: 'restaurant_owner',
    });
    ownerId = regRes.body.data.user.id;

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'owner.kitchen@example.com',
      password: 'SecurePassword123!',
    });
    ownerToken = loginRes.body.data.tokens.accessToken;

    // Create restaurant
    const rest = await Restaurant.create({
      name: 'Gourmet Bistro',
      slug: 'gourmet-bistro',
      ownerId,
      cuisine: ['Italian'],
      address: {
        street: '100 Foodie Lane',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        location: { type: 'Point', coordinates: [77.5946, 12.9716] },
      },
      status: 'active',
    });
    restaurantId = rest._id.toString();

    // Create a mock canonical order
    const orderDoc = await Order.create({
      orderNumber: 'FEASTO-8001',
      customerId: new mongoose.Types.ObjectId(),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      items: [
        {
          itemId: new mongoose.Types.ObjectId(),
          itemName: 'Truffle Pasta',
          basePrice: 450,
          quantity: 2,
          itemTotal: 900,
        },
      ],
      pricingSnapshot: {
        subtotal: 900,
        taxAmount: 45,
        deliveryFee: 50,
        packagingFee: 20,
        discountAmount: 0,
        tipAmount: 0,
        totalAmount: 1015,
        currency: 'INR',
      },
      deliveryAddressSnapshot: {
        label: 'Home',
        street: '123 Main St',
        city: 'Bengaluru',
        state: 'KA',
        zipCode: '560001',
        country: 'IN',
      },
      orderType: 'delivery',
      orderStatus: 'placed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'unassigned',
    });
    orderId = orderDoc._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Restaurant Order Operations', () => {
    it('should view incoming orders and accept an order', async () => {
      // 1. Incoming orders
      const incRes = await request(app)
        .get(`/api/v1/restaurants/${restaurantId}/orders/incoming`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(incRes.status).toBe(200);
      expect(incRes.body.data.length).toBe(1);

      // 2. Accept order
      const acceptRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/accept`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ estimatedPreparationTimeMinutes: 25 });

      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.data.orderStatus).toBe('accepted');

      // 3. View timeline
      const timeRes = await request(app)
        .get(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/timeline`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(timeRes.status).toBe(200);
      expect(timeRes.body.data.length).toBeGreaterThan(0);
    });

    it('should report order delay and report operational pause', async () => {
      // Report delay
      const delayRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/delay`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          reason: 'kitchen_overload',
          delayMinutes: 15,
          notes: 'High rush during dinner peak',
        });

      expect(delayRes.status).toBe(201);
      expect(delayRes.body.data.delayMinutes).toBe(15);

      // Pause restaurant
      const pauseRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/operations/pause`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ durationMinutes: 30, pauseReason: 'Kitchen overload' });

      expect(pauseRes.status).toBe(200);
      expect(pauseRes.body.data.status).toBe('PAUSED');
      expect(pauseRes.body.data.isPaused).toBe(true);

      // Resume restaurant
      const resumeRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/operations/resume`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(resumeRes.status).toBe(200);
      expect(resumeRes.body.data.status).toBe('OPEN');
    });
  });

  describe('Kitchen Display System & Stations', () => {
    it('should create kitchen stations and manage queue', async () => {
      // 1. Create Station
      const stnRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/kitchen/stations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Pasta & Pizza Station', code: 'PASTA', displayOrder: 1 });

      expect(stnRes.status).toBe(201);
      expect(stnRes.body.data.name).toBe('Pasta & Pizza Station');

      // 2. Fetch KDS Queue
      const queueRes = await request(app)
        .get(`/api/v1/restaurants/${restaurantId}/kitchen/queue`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(queueRes.status).toBe(200);

      // 3. Start Kitchen Order
      const startRes = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/kitchen/orders/${orderId}/start`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(startRes.status).toBe(200);
      expect(startRes.body.data.status).toBe('PREPARING');
    });
  });

  describe('Pickup Handoff', () => {
    it('should start and confirm pickup handoff to rider', async () => {
      // Start handoff
      const startHandoff = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/handoff/start`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ verificationCode: '9988' });

      expect(startHandoff.status).toBe(200);
      expect(startHandoff.body.data.status).toBe('HANDOFF_STARTED');

      // Confirm handoff
      const confirmHandoff = await request(app)
        .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/handoff/confirm`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ verificationCode: '9988' });

      expect(confirmHandoff.status).toBe(200);
      expect(confirmHandoff.body.data.status).toBe('COMPLETED');
      expect(confirmHandoff.body.data.isVerified).toBe(true);
    });
  });
});
