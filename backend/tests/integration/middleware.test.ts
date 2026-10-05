/// <reference types="jest" />
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Middleware Integration Tests', () => {
  const app = createApp();

  it('GET /non-existent-route should return 404 with structured error', async () => {
    const response = await request(app).get('/api/v1/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
  });

  it('GET /api/v1/docs should serve Swagger UI', async () => {
    const response = await request(app).get('/api/v1/docs/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Swagger UI');
  });
});
