/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';
import { Rider } from '../../src/modules/riders/riders.model.js';
import { DeliveryTrackingSession } from '../../src/modules/tracking/tracking.model.js';
import { RiderLocationHistory } from '../../src/modules/tracking/models/riderLocationHistory.model.js';
import { GeofenceEvent } from '../../src/modules/tracking/models/geofenceEvent.model.js';

describe('Tracking & Live Location Stream Integration Tests', () => {
  const app = createApp();
  let customerToken: string;
  let riderToken: string;
  let orderId: string;
  let riderId: string;
  let restaurantId: string;
  let branchId: string;
  let customerId: string;

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
    await DeliveryTrackingSession.deleteMany({});
    await RiderLocationHistory.deleteMany({});
    await GeofenceEvent.deleteMany({});

    // Customer
    const custRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Alice Customer',
      email: 'alice.cust@example.com',
      password: 'SecurePassword123!',
      role: 'customer',
    });
    customerId = custRes.body.data.user.id;

    const custLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'alice.cust@example.com',
      password: 'SecurePassword123!',
    });
    customerToken = custLogin.body.data.tokens.accessToken;

    // Rider
    const riderUser = await request(app).post('/api/v1/auth/register').send({
      name: 'Speedy Rider',
      email: 'speedy.rider@example.com',
      password: 'SecurePassword123!',
      role: 'rider',
    });
    const riderLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'speedy.rider@example.com',
      password: 'SecurePassword123!',
    });
    riderToken = riderLogin.body.data.tokens.accessToken;

    const riderProfile = await request(app)
      .post('/api/v1/riders')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        fullName: 'Speedy Rider',
        phone: '+14155559999',
        email: 'speedy.rider@example.com',
      });
    riderId = riderProfile.body.data._id;

    restaurantId = new mongoose.Types.ObjectId().toString();
    branchId = new mongoose.Types.ObjectId().toString();

    // Order
    const order = await Order.create({
      orderNumber: 'FST-20260728-1001',
      customerId,
      restaurantId,
      branchId,
      riderId,
      orderType: 'delivery',
      orderStatus: 'out_for_delivery',
      paymentStatus: 'paid',
      fulfillmentStatus: 'assigned',
      items: [
        {
          itemId: new mongoose.Types.ObjectId(),
          itemName: 'Special Burger',
          basePrice: 15.0,
          quantity: 1,
          addons: [],
          itemTotal: 15.0,
        },
      ],
      pricing: {
        subtotal: 15.0,
        taxAmount: 1.2,
        deliveryFee: 3.99,
        packagingFee: 1.5,
        discountAmount: 0,
        tipAmount: 2.0,
        totalAmount: 23.69,
        currency: 'USD',
      },
    });
    orderId = order._id.toString();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. POST /api/v1/tracking/sessions creates active delivery tracking session', async () => {
    const res = await request(app)
      .post('/api/v1/tracking/sessions')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        orderId,
        riderId,
        restaurantId,
        branchId,
        customerId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('active');
    expect(res.body.data).toHaveProperty('sessionId');
  });

  it('2. POST /api/v1/tracking/sessions/:sessionId/location records GPS location ping', async () => {
    const sessionRes = await request(app)
      .post('/api/v1/tracking/sessions')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ orderId, riderId, restaurantId, branchId, customerId });

    const sessionId = sessionRes.body.data.sessionId;

    const locRes = await request(app)
      .post(`/api/v1/tracking/sessions/${sessionId}/location`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        latitude: 37.7749,
        longitude: -122.4194,
        heading: 180,
        speed: 22.5,
        accuracy: 5.0,
      });

    expect(locRes.status).toBe(200);
    expect(locRes.body.data.currentLocation.latitude).toBe(37.7749);
  });

  it('3. GET /api/v1/orders/:orderId/tracking returns customer delivery tracking view', async () => {
    // Start session and push location
    const sessionRes = await request(app)
      .post('/api/v1/tracking/sessions')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ orderId, riderId, restaurantId, branchId, customerId });

    await request(app)
      .post(`/api/v1/tracking/sessions/${sessionRes.body.data.sessionId}/location`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ latitude: 37.7749, longitude: -122.4194 });

    const trackRes = await request(app)
      .get(`/api/v1/orders/${orderId}/tracking`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(trackRes.status).toBe(200);
    expect(trackRes.body.data.orderId).toBe(orderId);
    expect(trackRes.body.data.currentLocation.latitude).toBe(37.7749);
  });

  it('4. POST /api/v1/tracking/sessions/:sessionId/geofence/enter records geofence event', async () => {
    const sessionRes = await request(app)
      .post('/api/v1/tracking/sessions')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ orderId, riderId, restaurantId, branchId, customerId });

    const sessionId = sessionRes.body.data.sessionId;

    const geoRes = await request(app)
      .post(`/api/v1/tracking/sessions/${sessionId}/geofence/enter`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        geofenceType: 'restaurant',
        eventType: 'enter',
      });

    expect(geoRes.status).toBe(201);
    expect(geoRes.body.data.geofenceType).toBe('restaurant');
    expect(geoRes.body.data.eventType).toBe('enter');
  });
});
