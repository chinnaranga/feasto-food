/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Rider } from '../../src/modules/riders/riders.model.js';
import { RiderVehicle } from '../../src/modules/riders/models/riderVehicle.model.js';
import { RiderDocument } from '../../src/modules/riders/models/riderDocument.model.js';
import { RiderAvailability } from '../../src/modules/riders/models/riderAvailability.model.js';
import { RiderAssignment } from '../../src/modules/riders/models/riderAssignment.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';

describe('Rider Module & Delivery Operations Integration Tests', () => {
  const app = createApp();
  let riderToken: string;
  let riderId: string;

  const riderUser = {
    name: 'Speedy Sam',
    email: 'sam.rider@example.com',
    password: 'SecurePassword123!',
    role: 'rider',
  };

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Rider.deleteMany({});
    await RiderVehicle.deleteMany({});
    await RiderDocument.deleteMany({});
    await RiderAvailability.deleteMany({});
    await RiderAssignment.deleteMany({});
    await Order.deleteMany({});

    // Register & Login Rider
    await request(app).post('/api/v1/auth/register').send(riderUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: riderUser.email,
      password: riderUser.password,
    });
    riderToken = loginRes.body.data.tokens.accessToken;

    // Create Rider Profile
    const profileRes = await request(app)
      .post('/api/v1/riders')
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        fullName: riderUser.name,
        phone: '+14155558888',
        email: riderUser.email,
        preferredZones: ['Downtown', 'Mission'],
      });

    riderId = profileRes.body.data._id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. Rider Profile & Summary: Retrieve rider profile details and setup stats', async () => {
    const summaryRes = await request(app)
      .get(`/api/v1/riders/${riderId}/summary`)
      .set('Authorization', `Bearer ${riderToken}`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.success).toBe(true);
    expect(summaryRes.body.data.fullName).toBe('Speedy Sam');
    expect(summaryRes.body.data.stats.vehiclesCount).toBe(0);
  });

  it('2. Vehicle Management: Add vehicle and set as primary', async () => {
    const vehicleRes = await request(app)
      .post(`/api/v1/riders/${riderId}/vehicles`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        vehicleType: 'scooter',
        vehicleBrand: 'Vespa',
        vehicleModel: 'Primavera 150',
        vehicleNumber: 'CA-98765',
        isPrimary: true,
      });

    expect(vehicleRes.status).toBe(201);
    expect(vehicleRes.body.data.vehicleType).toBe('scooter');
    expect(vehicleRes.body.data.isPrimary).toBe(true);

    const listRes = await request(app)
      .get(`/api/v1/riders/${riderId}/vehicles`)
      .set('Authorization', `Bearer ${riderToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
  });

  it('3. Document Verification: Upload driver license metadata and update status', async () => {
    const docRes = await request(app)
      .post(`/api/v1/riders/${riderId}/documents`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({
        documentType: 'driver_license',
        documentNumber: 'DL-12345678',
        documentUrl: 'https://cloudinary.com/docs/dl_sam.pdf',
      });

    expect(docRes.status).toBe(201);
    expect(docRes.body.data.status).toBe('pending_review');

    const documentId = docRes.body.data._id;

    // Update status to approved
    const approveRes = await request(app)
      .patch(`/api/v1/riders/${riderId}/documents/${documentId}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'approved' });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe('approved');
  });

  it('4. Shift Availability & Zone Preferences: Toggle online/offline state and update zones', async () => {
    // Add primary vehicle and approved docs first to meet readiness
    await request(app)
      .post(`/api/v1/riders/${riderId}/vehicles`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ vehicleType: 'bicycle', isPrimary: true });

    const doc1 = await request(app)
      .post(`/api/v1/riders/${riderId}/documents`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ documentType: 'driver_license', documentUrl: 'https://cloudinary.com/dl.pdf' });

    const doc2 = await request(app)
      .post(`/api/v1/riders/${riderId}/documents`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ documentType: 'national_id', documentUrl: 'https://cloudinary.com/id.pdf' });

    await request(app)
      .patch(`/api/v1/riders/${riderId}/documents/${doc1.body.data._id}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'approved' });

    await request(app)
      .patch(`/api/v1/riders/${riderId}/documents/${doc2.body.data._id}`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ status: 'approved' });

    // Update Rider verificationStatus to verified
    await Rider.findByIdAndUpdate(riderId, { verificationStatus: 'verified', accountStatus: 'active' });

    // Toggle Online
    const availRes = await request(app)
      .patch(`/api/v1/riders/${riderId}/availability`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ isOnline: true });

    expect(availRes.status).toBe(200);
    expect(availRes.body.data.isOnline).toBe(true);

    // Update Preferred Zones
    const zoneRes = await request(app)
      .patch(`/api/v1/riders/${riderId}/zones`)
      .set('Authorization', `Bearer ${riderToken}`)
      .send({ currentZone: 'Financial District', preferredZones: ['Financial District', 'SOMA'] });

    expect(zoneRes.status).toBe(200);
    expect(zoneRes.body.data.currentZone).toBe('Financial District');
  });

  it('5. Dispatch Readiness: Check eligibility endpoint response', async () => {
    const readinessRes = await request(app)
      .get(`/api/v1/riders/${riderId}/readiness`)
      .set('Authorization', `Bearer ${riderToken}`);

    expect(readinessRes.status).toBe(200);
    expect(readinessRes.body.data).toHaveProperty('isEligibleForDispatch');
    expect(readinessRes.body.data).toHaveProperty('missingRequirements');
  });
});
