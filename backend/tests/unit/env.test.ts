/// <reference types="jest" />
import { env } from '../../src/config/env.js';

describe('Environment Configuration Unit Tests', () => {
  it('should parse environment defaults cleanly', () => {
    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBeDefined();
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.JWT_REFRESH_SECRET).toBeDefined();
  });
});
