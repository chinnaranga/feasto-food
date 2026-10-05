import { rateLimit } from 'express-rate-limit';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      details: null,
    },
    timestamp: new Date().toISOString(),
  },
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Too many password reset requests. Please try again after an hour.',
      details: null,
    },
    timestamp: new Date().toISOString(),
  },
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});
