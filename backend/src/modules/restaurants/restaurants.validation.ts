import { z } from 'zod';
import { RESTAURANT_CONSTANTS } from './restaurants.constants.js';

export const createRestaurantSchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters').max(100),
  legalBusinessName: z.string().min(2, 'Legal business name is required').max(150),
  description: z.string().max(1000).optional(),
  cuisineTypes: z.array(z.string()).min(1, 'At least one cuisine type must be selected'),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5).max(20),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2).default('US'),
  timezone: z.string().optional().default('UTC'),
  currency: z.string().length(3).optional().default('USD'),
  serviceModes: z
    .object({
      dineIn: z.boolean().optional(),
      takeaway: z.boolean().optional(),
      delivery: z.boolean().optional(),
      pickup: z.boolean().optional(),
    })
    .optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  operationalStatus: z.enum(['open', 'closed', 'busy', 'paused']).optional(),
  accountStatus: z.enum(['active', 'suspended']).optional(),
});

export const createBranchSchema = z.object({
  branchName: z.string().min(2, 'Branch name is required').max(100),
  branchCode: z.string().min(2).max(20),
  branchManagerId: z.string().optional(),
  phone: z.string().min(5).max(20),
  email: z.string().email('Invalid email address'),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2).default('US'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isMainBranch: z.boolean().optional().default(false),
});

export const updateBranchSchema = createBranchSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'temporarily_closed']).optional(),
});

const dailyScheduleSchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm (24-hr)'),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm (24-hr)'),
  isOpen: z.boolean(),
});

export const updateHoursSchema = z.object({
  openingHours: z.array(dailyScheduleSchema).optional(),
  kitchenHours: z.array(dailyScheduleSchema).optional(),
  deliveryHours: z.array(dailyScheduleSchema).optional(),
  pickupHours: z.array(dailyScheduleSchema).optional(),
  holidayHours: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
        reason: z.string().min(2),
        isOpen: z.boolean(),
        open: z.string().optional(),
        close: z.string().optional(),
      })
    )
    .optional(),
});

export const updateSettingsSchema = z.object({
  orderSettings: z
    .object({
      autoAcceptOrders: z.boolean().optional(),
      prepTimeMinutes: z.number().min(5).max(120).optional(),
      minOrderValue: z.number().min(0).optional(),
    })
    .optional(),
  notificationSettings: z
    .object({
      newOrderEmail: z.boolean().optional(),
      newOrderPush: z.boolean().optional(),
      newOrderSms: z.boolean().optional(),
    })
    .optional(),
  serviceToggles: z
    .object({
      allowDineIn: z.boolean().optional(),
      allowTakeaway: z.boolean().optional(),
      allowDelivery: z.boolean().optional(),
      allowPickup: z.boolean().optional(),
      pauseOrders: z.boolean().optional(),
    })
    .optional(),
});

export const submitVerificationSchema = z.object({
  businessLicenseNumber: z.string().min(3, 'Business license number is required'),
  taxId: z.string().min(3, 'Tax ID is required'),
  ownerIdentityDocumentUrl: z.string().url('Owner identity document URL is required'),
  proofOfAddressUrl: z.string().url('Proof of address document URL is required'),
});

export const addStaffAccessSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  branchId: z.string().optional(),
  role: z.enum([
    'restaurant_owner',
    'restaurant_manager',
    'kitchen_staff',
    'cashier',
    'inventory_manager',
  ]),
  assignedPermissions: z.array(z.string()).optional(),
});

export const updateStaffAccessSchema = addStaffAccessSchema.partial().extend({
  isActive: z.boolean().optional(),
});
