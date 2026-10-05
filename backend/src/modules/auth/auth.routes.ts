import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authRateLimiter, passwordResetRateLimiter } from './auth.middleware.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  resendVerificationSchema,
} from './auth.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './auth.docs.js';

const router = Router();

// Public Authentication Endpoints
router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  catchAsync(authController.register)
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  catchAsync(authController.login)
);

router.post(
  '/refresh',
  validateRequest({ body: refreshTokenSchema }),
  catchAsync(authController.refresh)
);

router.post(
  '/verify-email',
  validateRequest({ body: verifyEmailSchema }),
  catchAsync(authController.verifyEmail)
);

router.post(
  '/verify-otp',
  validateRequest({ body: verifyOtpSchema }),
  catchAsync(authController.verifyOtp)
);

router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  catchAsync(authController.forgotPassword)
);

router.post(
  '/reset-password',
  passwordResetRateLimiter,
  validateRequest({ body: resetPasswordSchema }),
  catchAsync(authController.resetPassword)
);

router.post(
  '/resend-verification',
  passwordResetRateLimiter,
  validateRequest({ body: resendVerificationSchema }),
  catchAsync(authController.resendVerification)
);

// Protected Authentication & Session Endpoints
router.get('/me', authenticate, catchAsync(authController.getMe));

router.post('/logout', authenticate, catchAsync(authController.logout));

router.post('/logout-all', authenticate, catchAsync(authController.logoutAll));

router.get('/sessions', authenticate, catchAsync(authController.getSessions));

router.delete('/sessions/:sessionId', authenticate, catchAsync(authController.revokeSession));

export default router;
