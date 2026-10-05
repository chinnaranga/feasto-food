import { rateLimit } from 'express-rate-limit';
import { env } from '../../config/env.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 60 * 1000,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: `Too many requests from this IP. Please try again after ${env.RATE_LIMIT_WINDOW} minutes.`,
      details: null,
    },
    timestamp: new Date().toISOString(),
  },
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});
