/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { NotificationModel } from '../../src/modules/notifications/models/notification.model.js';
import { NotificationPreferencesModel } from '../../src/modules/notifications/models/notificationPreferences.model.js';
import { NotificationDeviceModel } from '../../src/modules/notifications/models/notificationDevice.model.js';
import { NotificationEventModel } from '../../src/modules/notifications/models/notificationEvent.model.js';

describe('Phase 9 — Notifications, Messaging & Communication Platform Integration Tests', () => {
  const app = createApp();
  let userToken: string;
  let userId: string;
  let notificationId: string;
  let deviceId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await NotificationModel.deleteMany({});
    await NotificationPreferencesModel.deleteMany({});
    await NotificationDeviceModel.deleteMany({});
    await NotificationEventModel.deleteMany({});

    // Register user
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Diana User',
      email: 'diana.notif@example.com',
      password: 'SecurePassword123!',
      role: 'customer',
    });
    userId = regRes.body.data.user.id;

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'diana.notif@example.com',
      password: 'SecurePassword123!',
    });
    userToken = loginRes.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Notification Dispatch & Feed', () => {
    it('should dispatch domain event and generate notifications across enabled channels', async () => {
      // 1. Dispatch event
      const dispatchRes = await request(app)
        .post('/api/v1/notifications/events/dispatch')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          type: 'ORDER_PLACED',
          recipientUserId: userId,
          entityType: 'order',
          entityId: 'ord_notif_101',
          payload: {
            orderNumber: 'FEASTO-1001',
            amount: '650',
            restaurantName: 'Biryani Blues',
          },
          priority: 'NORMAL',
        });

      expect(dispatchRes.status).toBe(200);
      expect(dispatchRes.body.success).toBe(true);
      expect(dispatchRes.body.data.dispatched).toBe(true);

      // 2. Fetch in-app notifications
      const feedRes = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      expect(feedRes.status).toBe(200);
      expect(feedRes.body.data.length).toBeGreaterThan(0);
      expect(feedRes.body.data[0].title).toContain('Order Confirmed!');
      notificationId = feedRes.body.data[0].notificationId;

      // 3. Get unread count
      const unreadRes = await request(app)
        .get('/api/v1/notifications/unread')
        .set('Authorization', `Bearer ${userToken}`);

      expect(unreadRes.status).toBe(200);
      expect(unreadRes.body.data.count).toBeGreaterThan(0);
    });

    it('should mark single notification and all notifications as read', async () => {
      // Dispatch event
      await request(app)
        .post('/api/v1/notifications/events/dispatch')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          type: 'SECURITY_ALERT',
          recipientUserId: userId,
          payload: { device: 'MacBook Pro', location: 'Bengaluru' },
        });

      const feedRes = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`);

      const notifId = feedRes.body.data[0].notificationId;

      // Mark single read
      const readRes = await request(app)
        .patch(`/api/v1/notifications/${notifId}/read`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(readRes.status).toBe(200);
      expect(readRes.body.data.readAt).toBeDefined();

      // Mark all read
      const readAllRes = await request(app)
        .patch('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${userToken}`);

      expect(readAllRes.status).toBe(200);
      expect(readAllRes.body.data.modifiedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Preferences & Push Device Registration', () => {
    it('should fetch and update notification preferences', async () => {
      // Get preferences
      const getPref = await request(app)
        .get('/api/v1/notifications/preferences')
        .set('Authorization', `Bearer ${userToken}`);

      expect(getPref.status).toBe(200);
      expect(getPref.body.data.channelPreferences).toBeDefined();

      // Update preferences
      const updatePref = await request(app)
        .patch('/api/v1/notifications/preferences')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          channelPreferences: {
            orderUpdates: { sms: false, push: true },
          },
        });

      expect(updatePref.status).toBe(200);
      expect(updatePref.body.data.channelPreferences.orderUpdates.sms).toBe(false);
    });

    it('should register and remove push device token', async () => {
      // Register device
      const regDev = await request(app)
        .post('/api/v1/notifications/devices')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          token: 'fcm_token_test_abc123',
          platform: 'web',
          appVersion: '2.1.0',
        });

      expect(regDev.status).toBe(201);
      expect(regDev.body.data.token).toBe('fcm_token_test_abc123');
      deviceId = regDev.body.data.deviceId;

      // List devices
      const listDev = await request(app)
        .get('/api/v1/notifications/devices')
        .set('Authorization', `Bearer ${userToken}`);

      expect(listDev.status).toBe(200);
      expect(listDev.body.data.length).toBe(1);

      // Remove device
      const delDev = await request(app)
        .delete(`/api/v1/notifications/devices/${deviceId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(delDev.status).toBe(200);
    });
  });

  describe('Health Report Verification', () => {
    it('should report notification services health', async () => {
      const healthRes = await request(app).get('/api/v1/health');
      expect(healthRes.status).toBe(200);
      expect(healthRes.body.data.services.notificationService).toBeDefined();
      expect(healthRes.body.data.services.notificationQueue).toBeDefined();
    });
  });
});
