import { z } from 'zod';
import {
  RESTAURANT_OPERATIONAL_STATUSES,
  DELAY_REASONS,
} from './restaurantOperations.constants.js';

export const updateOperationalStatusSchema = z.object({
  status: z.enum(RESTAURANT_OPERATIONAL_STATUSES),
  pauseReason: z.string().optional(),
  pausedUntil: z.string().optional(),
});

export const pauseRestaurantSchema = z.object({
  pauseReason: z.string().min(1, 'Pause reason is required'),
  durationMinutes: z.number().positive().default(30),
});

export const acceptOrderSchema = z.object({
  estimatedPreparationTimeMinutes: z.number().positive().default(20),
  notes: z.string().optional(),
});

export const rejectOrderSchema = z.object({
  reason: z.string().min(3, 'Rejection reason must be at least 3 characters'),
});

export const delayOrderSchema = z.object({
  reason: z.enum(DELAY_REASONS),
  delayMinutes: z.number().positive('Delay minutes must be positive'),
  notes: z.string().optional(),
});

export const prepareOrderSchema = z.object({
  notes: z.string().optional(),
});

export const readyOrderSchema = z.object({
  notes: z.string().optional(),
});
