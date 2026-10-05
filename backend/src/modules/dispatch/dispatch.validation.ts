import { z } from 'zod';
import { REJECTION_REASONS } from './dispatch.constants.js';

export const triggerDispatchSchema = z.object({
  priority: z.enum(['NORMAL', 'HIGH', 'URGENT']).optional().default('NORMAL'),
});

export const rejectOfferSchema = z.object({
  reason: z.enum(REJECTION_REASONS).optional().default('OTHER'),
});

export const updateDispatchConfigSchema = z.object({
  maxDispatchRadiusKm: z.number().positive().optional(),
  offerTimeoutSeconds: z.number().positive().optional(),
  maxAssignmentAttempts: z.number().positive().optional(),
  maxActiveDeliveriesPerRider: z.number().positive().optional(),
  locationFreshnessThresholdSeconds: z.number().positive().optional(),
  minimumRiderScore: z.number().optional(),
  retryDelaySeconds: z.number().positive().optional(),
  priorityMultiplier: z.number().positive().optional(),
});
