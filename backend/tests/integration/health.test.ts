/// <reference types="jest" />
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Health Check Endpoint Integration Test', () => {
  const app = createApp();

  it('GET /api/v1/health should return status 200 with system report', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('uptimeSeconds');
    expect(response.body.data).toHaveProperty('services');
    expect(response.body.data.services).toHaveProperty('api');
  });
});
