import { z } from 'zod';
import { HANDOVER_STATUSES } from './pickup.constants.js';

export const startHandoffSchema = z.object({
  riderId: z.string().optional(),
  verificationCode: z.string().optional(),
});

export const confirmHandoffSchema = z.object({
  verificationCode: z.string().optional(),
});
