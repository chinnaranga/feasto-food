import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many authentication attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count even successful attempts
});

/**
 * General API rate limiter (already exists in app.js but exported here)
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Webhook rate limiter (more lenient for payment providers)
 */
export const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Webhook rate limit exceeded',
    standardHeaders: true,
    legacyHeaders: false,
});
