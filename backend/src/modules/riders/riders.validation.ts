import { z } from 'zod';

export const createRiderSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  profilePhoto: z.string().url().optional(),
  preferredZones: z.array(z.string()).optional().default([]),
});

export const updateRiderSchema = createRiderSchema.partial().extend({
  currentZone: z.string().optional(),
  accountStatus: z.enum(['active', 'pending_verification', 'suspended', 'banned']).optional(),
});

export const addVehicleSchema = z.object({
  vehicleType: z.enum(['bicycle', 'scooter', 'motorcycle', 'car']),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleColor: z.string().optional(),
  vehicleNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  isPrimary: z.boolean().optional().default(true),
});

export const updateVehicleSchema = addVehicleSchema.partial();

export const uploadDocumentSchema = z.object({
  documentType: z.enum([
    'driver_license',
    'national_id',
    'vehicle_registration',
    'insurance_proof',
    'background_check',
  ]),
  documentNumber: z.string().optional(),
  documentUrl: z.string().url('Document URL must be a valid URL'),
  expiryDate: z.string().optional(),
});

export const updateDocumentStatusSchema = z.object({
  status: z.enum(['pending_review', 'approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

export const updateAvailabilitySchema = z.object({
  isOnline: z.boolean(),
  breakMode: z.boolean().optional().default(false),
});

export const updateZonesSchema = z.object({
  currentZone: z.string().optional(),
  preferredZones: z.array(z.string()).optional().default([]),
});

export const updateDeliveryStatusSchema = z.object({
  deliveryStatus: z.enum([
    'assigned',
    'arrived_at_restaurant',
    'picked_up',
    'arrived_at_customer',
    'delivered',
  ]),
});
