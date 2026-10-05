import { z } from 'zod';
import { ITEM_PREPARATION_STATUSES, KITCHEN_ORDER_PRIORITIES } from './kitchen.constants.js';

export const createStationSchema = z.object({
  name: z.string().min(1, 'Station name is required'),
  code: z.string().min(1, 'Station code is required'),
  displayOrder: z.number().optional().default(0),
  capacity: z.number().positive().optional().default(10),
});

export const updateStationSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  status: z.enum(['active', 'inactive', 'busy']).optional(),
  displayOrder: z.number().optional(),
  capacity: z.number().optional(),
  active: z.boolean().optional(),
});

export const updateKitchenOrderSchema = z.object({
  priority: z.enum(KITCHEN_ORDER_PRIORITIES).optional(),
  estimatedPreparationTimeMinutes: z.number().positive().optional(),
  specialInstructions: z.string().optional(),
});

export const updateKitchenItemSchema = z.object({
  status: z.enum(ITEM_PREPARATION_STATUSES),
  stationId: z.string().optional(),
});
