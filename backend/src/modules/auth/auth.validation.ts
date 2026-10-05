import { z } from 'zod';
import { ALL_ROLES } from '../../shared/constants/roles.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters'),
  role: z.enum(ALL_ROLES as [string, ...string[]]).optional(),
  preferredLanguage: z.string().optional().default('en'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  otp: z.string().optional(),
}).refine((data: { email?: string; phone?: string }) => data.email || data.phone, {
  message: 'Either email or phone is required for login',
  path: ['email'],
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  token: z.string().min(6, 'Verification token/code is required'),
});

export const verifyOtpSchema = z.object({
  target: z.string().min(3, 'Target email or phone number is required'),
  code: z.string().length(6, 'OTP must be exactly 6 digits'),
  type: z.enum(['email_verification', 'phone_verification', 'password_reset', 'login_otp']),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  target: z.string().min(3, 'Target email or phone is required'),
  code: z.string().length(6, 'Reset code must be exactly 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
});

export const googleAuthSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  name: z.string().min(1, 'Name is required'),
  googleId: z.string().min(1, 'Google ID is required'),
  photoUrl: z.string().url().optional(),
});
