/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Address } from '../../src/modules/users/models/address.model.js';
import { Favorite } from '../../src/modules/users/models/favorite.model.js';
import { UserPreferences } from '../../src/modules/users/models/userPreferences.model.js';

describe('User Profile & Account Management Integration Tests', () => {
  const app = createApp();
  let accessToken: string;
  let userId: string;

  const testUser = {
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    password: 'SecurePassword123!',
    role: 'customer',
  };

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Address.deleteMany({});
    await Favorite.deleteMany({});
    await UserPreferences.deleteMany({});

    // Register & Login to get token
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    accessToken = loginRes.body.data.tokens.accessToken;
    userId = loginRes.body.data.user.id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. GET /api/v1/users/me should return authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data).toHaveProperty('profileCompleteness');
  });

  it('2. PATCH /api/v1/users/me should update profile bio and preferred currency', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bio: 'Avid food lover',
        preferredCurrency: 'USD',
        preferredLanguage: 'en',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bio).toBe('Avid food lover');
  });

  it('3. Address CRUD endpoints should handle adding, listing, and soft-deleting addresses', async () => {
    // Add Address
    const addRes = await request(app)
      .post('/api/v1/users/me/addresses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        label: 'Home',
        street: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        isDefault: true,
      });

    expect(addRes.status).toBe(200);
    expect(addRes.body.data.label).toBe('Home');
    const addressId = addRes.body.data._id;

    // List Addresses
    const listRes = await request(app)
      .get('/api/v1/users/me/addresses')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);

    // Delete Address
    const delRes = await request(app)
      .delete(`/api/v1/users/me/addresses/${addressId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(delRes.status).toBe(200);
  });

  it('4. Favorites endpoints should add and list favorite items', async () => {
    const addFavRes = await request(app)
      .post('/api/v1/users/me/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entityType: 'restaurant',
        entityId: 'rest_12345',
        metadata: { name: 'Gourmet Bistro', rating: 4.8 },
      });

    expect(addFavRes.status).toBe(200);
    expect(addFavRes.body.data.entityId).toBe('rest_12345');

    const listFavRes = await request(app)
      .get('/api/v1/users/me/favorites')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(listFavRes.status).toBe(200);
    expect(listFavRes.body.data.length).toBe(1);
  });

  it('5. GET /api/v1/users/me/summary should return account health score and statistics', async () => {
    const summaryRes = await request(app)
      .get('/api/v1/users/me/summary')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.success).toBe(true);
    expect(summaryRes.body.data).toHaveProperty('profileCompleteness');
    expect(summaryRes.body.data).toHaveProperty('healthStatus');
    expect(summaryRes.body.data.stats).toHaveProperty('savedAddressesCount');
  });
});
