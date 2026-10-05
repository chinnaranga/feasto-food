/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Session } from '../../src/modules/auth/models/session.model.js';
import { VerificationCode } from '../../src/modules/auth/models/verificationCode.model.js';

describe('Authentication & Session Management Integration Tests', () => {
  const app = createApp();

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await Session.deleteMany({});
      await VerificationCode.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  const testUser = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'SecurePassword123!',
    role: 'customer',
  };

  it('1. POST /api/v1/auth/register should register user and generate verification code', async () => {
    const response = await request(app).post('/api/v1/auth/register').send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);

    // Verify user saved in DB
    const dbUser = await User.findOne({ email: testUser.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.accountStatus).toBe('pending_verification');

    // Verify OTP document created
    const code = await VerificationCode.findOne({ target: testUser.email });
    expect(code).not.toBeNull();
  });

  it('2. POST /api/v1/auth/login should authenticate user and issue tokens and session', async () => {
    // Register user first
    await request(app).post('/api/v1/auth/register').send(testUser);

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data).toHaveProperty('tokens');
    expect(loginRes.body.data.tokens).toHaveProperty('accessToken');
    expect(loginRes.body.data.tokens).toHaveProperty('refreshToken');
    expect(loginRes.body.data).toHaveProperty('session');

    // Verify session in DB
    const sessionCount = await Session.countDocuments({ isRevoked: false });
    expect(sessionCount).toBe(1);
  });

  it('3. GET /api/v1/auth/me should return current user profile with valid Bearer token', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const accessToken = loginRes.body.data.tokens.accessToken;

    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.email).toBe(testUser.email);
    expect(meRes.body.data).toHaveProperty('permissions');
  });

  it('4. POST /api/v1/auth/refresh should rotate refresh token and issue new token pair', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const refreshToken = loginRes.body.data.tokens.refreshToken;

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.tokens.accessToken).toBeDefined();
    expect(refreshRes.body.data.tokens.refreshToken).not.toBe(refreshToken);
  });

  it('5. POST /api/v1/auth/logout should revoke current session', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    const accessToken = loginRes.body.data.tokens.accessToken;
    const sessionId = loginRes.body.data.session.sessionId;

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ sessionId });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    const activeSession = await Session.findOne({ sessionId, isRevoked: false });
    expect(activeSession).toBeNull();
  });
});
