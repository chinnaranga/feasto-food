import { z } from 'zod';

export const createTrackingSessionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  riderId: z.string().min(1, 'Rider ID is required'),
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
});

export const pushLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360).optional(),
  speed: z.number().min(0).optional(),
  accuracy: z.number().min(0).optional(),
});

export const updateRouteSchema = z.object({
  waypoints: z.array(
    z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
  ),
  totalDistanceKm: z.number().min(0),
  estimatedDurationMinutes: z.number().min(0),
});

export const geofenceEventSchema = z.object({
  geofenceType: z.enum(['restaurant', 'customer', 'branch']),
  eventType: z.enum(['enter', 'exit']),
});

export const updateEtaSchema = z.object({
  etaMinutes: z.number().min(0),
  distanceRemainingKm: z.number().min(0),
});
