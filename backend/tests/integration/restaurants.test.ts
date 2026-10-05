/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { RestaurantBranch } from '../../src/modules/restaurants/models/restaurantBranch.model.js';
import { RestaurantHours } from '../../src/modules/restaurants/models/restaurantHours.model.js';
import { RestaurantSettings } from '../../src/modules/restaurants/models/restaurantSettings.model.js';
import { RestaurantVerification } from '../../src/modules/restaurants/models/restaurantVerification.model.js';
import { RestaurantStaffAccess } from '../../src/modules/restaurants/models/restaurantStaffAccess.model.js';

describe('Restaurant Workspace & Branch Management Integration Tests', () => {
  const app = createApp();
  let ownerToken: string;
  let ownerId: string;

  const ownerUser = {
    name: 'Chef Mario',
    email: 'mario.owner@example.com',
    password: 'SecurePassword123!',
    role: 'restaurant_owner',
  };

  const sampleRestaurant = {
    restaurantName: 'Mario Bistro',
    legalBusinessName: 'Mario Foods LLC',
    description: 'Authentic Italian wood-fired pizza and pasta',
    cuisineTypes: ['Italian', 'Fast Food'],
    email: 'mario.bistro@example.com',
    phone: '+14155559876',
    address: '100 Columbus Ave',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
  };

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await RestaurantBranch.deleteMany({});
    await RestaurantHours.deleteMany({});
    await RestaurantSettings.deleteMany({});
    await RestaurantVerification.deleteMany({});
    await RestaurantStaffAccess.deleteMany({});

    // Register & Login Owner
    await request(app).post('/api/v1/auth/register').send(ownerUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: ownerUser.email,
      password: ownerUser.password,
    });

    ownerToken = loginRes.body.data.tokens.accessToken;
    ownerId = loginRes.body.data.user.id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. POST /api/v1/restaurants should create workspace and auto-initialize main branch', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.restaurantName).toBe('Mario Bistro');
    expect(res.body.data.ownerUserId).toBe(ownerId);

    const restaurantId = res.body.data._id;

    // Verify Main Branch Auto-Created
    const branchesRes = await request(app)
      .get(`/api/v1/restaurants/${restaurantId}/branches`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(branchesRes.status).toBe(200);
    expect(branchesRes.body.data.length).toBe(1);
    expect(branchesRes.body.data[0].isMainBranch).toBe(true);
  });

  it('2. PATCH /api/v1/restaurants/:restaurantId should update description and operational status', async () => {
    const createRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    const restaurantId = createRes.body.data._id;

    const updateRes = await request(app)
      .patch(`/api/v1/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        description: 'Award winning Italian cuisine',
        operationalStatus: 'open',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.description).toBe('Award winning Italian cuisine');
    expect(updateRes.body.data.operationalStatus).toBe('open');
  });

  it('3. Branch CRUD should create secondary branch with GeoJSON location', async () => {
    const createRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    const restaurantId = createRes.body.data._id;

    const branchRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/branches`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        branchName: 'Mario Bistro Downtown',
        branchCode: 'DT-02',
        phone: '+14155551122',
        email: 'downtown@mario.com',
        address: '500 Howard St',
        city: 'San Francisco',
        state: 'CA',
        latitude: 37.788,
        longitude: -122.398,
      });

    expect(branchRes.status).toBe(201);
    expect(branchRes.body.data.branchName).toBe('Mario Bistro Downtown');
    expect(branchRes.body.data.location.coordinates).toEqual([-122.398, 37.788]);
  });

  it('4. POST /api/v1/restaurants/:restaurantId/verification/submit should update verification state', async () => {
    const createRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    const restaurantId = createRes.body.data._id;

    const verifyRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/verification/submit`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        businessLicenseNumber: 'LIC-998877',
        taxId: 'TAX-112233',
        ownerIdentityDocumentUrl: 'https://cloudinary.com/id.pdf',
        proofOfAddressUrl: 'https://cloudinary.com/utility.pdf',
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.status).toBe('pending_review');
  });

  it('5. GET /api/v1/restaurants/:restaurantId/summary should return workspace readiness score', async () => {
    const createRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    const restaurantId = createRes.body.data._id;

    const summaryRes = await request(app)
      .get(`/api/v1/restaurants/${restaurantId}/summary`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.data).toHaveProperty('profileCompleteness');
    expect(summaryRes.body.data).toHaveProperty('readinessStatus');
    expect(summaryRes.body.data.stats).toHaveProperty('totalBranchesCount');
  });
});
