import { z } from 'zod';
import { USER_CONSTANTS } from './users.constants.js';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  profilePhoto: z.string().url('Invalid profile photo URL').optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
  preferredCurrency: z.string().length(3, 'Currency code must be 3 uppercase letters').optional(),
  timezone: z.string().optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50).default('Home'),
  street: z.string().min(3, 'Street address is required').max(200),
  building: z.string().max(100).optional(),
  floor: z.string().max(50).optional(),
  apartment: z.string().max(50).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  zipCode: z.string().min(3, 'Zip/Postal code is required').max(20),
  country: z.string().min(2).max(100).default('US'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional().default(false),
  deliveryInstructions: z.string().max(300).optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addFavoriteSchema = z.object({
  entityType: z.enum(['restaurant', 'menu_item', 'branch']),
  entityId: z.string().min(1, 'Entity ID is required'),
  metadata: z
    .object({
      name: z.string().optional(),
      image: z.string().optional(),
      price: z.number().optional(),
      rating: z.number().optional(),
      cuisine: z.string().optional(),
    })
    .optional(),
});

export const updatePreferencesSchema = z.object({
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
  privacy: z
    .object({
      showProfilePhoto: z.boolean().optional(),
      allowDataAnalytics: z.boolean().optional(),
    })
    .optional(),
  accessibility: z
    .object({
      highContrast: z.boolean().optional(),
      screenReader: z.boolean().optional(),
    })
    .optional(),
  dietary: z
    .array(z.string())
    .refine(
      (tags: string[]) =>
        tags.every((t) => USER_CONSTANTS.SUPPORTED_DIETARY_TAGS.includes(t as typeof USER_CONSTANTS.SUPPORTED_DIETARY_TAGS[number])),
      { message: 'One or more unsupported dietary preference tags provided' }
    )
    .optional(),
});
