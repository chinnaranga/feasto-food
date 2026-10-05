import { z } from 'zod';
import { ADMIN_ROLES, VERIFICATION_STATUSES, SETTING_CATEGORIES } from './admin.constants.js';

export const suspendUserSchema = z.object({
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
});

export const restoreUserSchema = z.object({
  reason: z.string().optional(),
});

export const verifyEntitySchema = z.object({
  reason: z.string().optional(),
});

export const rejectEntitySchema = z.object({
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is required'),
});

export const overrideOrderSchema = z.object({
  newStatus: z.string().min(1, 'New status is required'),
  reason: z.string().min(3, 'Reason is required'),
});

export const refundPaymentSchema = z.object({
  amount: z.number().positive('Refund amount must be positive'),
  reason: z.string().min(3, 'Reason is required'),
});

export const updateSettingSchema = z.object({
  category: z.enum(SETTING_CATEGORIES),
  key: z.string().min(1, 'Setting key is required'),
  value: z.any(),
  description: z.string().optional(),
});

export const createStaffSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(ADMIN_ROLES),
  permissions: z.array(z.string()).default([]),
});

export const updateStaffSchema = z.object({
  role: z.enum(ADMIN_ROLES).optional(),
  permissions: z.array(z.string()).optional(),
  isSuspended: z.boolean().optional(),
});
