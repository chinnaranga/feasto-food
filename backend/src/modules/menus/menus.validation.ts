import { z } from 'zod';
import { MENU_CONSTANTS } from './menus.constants.js';

export const createMenuSchema = z.object({
  branchId: z.string().optional(),
  menuName: z.string().min(2, 'Menu name is required').max(100),
  menuDescription: z.string().max(500).optional(),
  menuType: z.enum(['regular', 'breakfast', 'lunch', 'dinner', 'special']).optional().default('regular'),
  visibility: z.enum(['public', 'hidden', 'private']).optional().default('public'),
  currency: z.string().length(3).optional().default('USD'),
});

export const updateMenuSchema = createMenuSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

export const createCategorySchema = z.object({
  categoryName: z.string().min(2, 'Category name is required').max(100),
  categoryDescription: z.string().max(300).optional(),
  parentCategoryId: z.string().optional(),
  displayOrder: z.number().min(0).optional().default(0),
  isFeatured: z.boolean().optional().default(false),
  visibility: z.enum(['public', 'hidden']).optional().default('public'),
});

export const updateCategorySchema = createCategorySchema.partial();

export const reorderCategoriesSchema = z.object({
  orderedCategoryIds: z.array(z.string()).min(1, 'Category IDs array required'),
});

export const createItemSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  itemName: z.string().min(2, 'Item name is required').max(120),
  itemDescription: z.string().max(500).optional(),
  basePrice: z.number().min(0, 'Price cannot be negative'),
  discountedPrice: z.number().min(0).optional(),
  currency: z.string().length(3).optional().default('USD'),
  isVeg: z.boolean().optional().default(true),
  dietaryTags: z.array(z.string()).optional().default([]),
  displayOrder: z.number().min(0).optional().default(0),
});

export const updateItemSchema = createItemSchema.partial().extend({
  availabilityStatus: z.enum(['available', 'out_of_stock', 'temporarily_unavailable']).optional(),
});

export const createVariantSchema = z.object({
  variantName: z.string().min(1, 'Variant name is required'),
  priceAdjustment: z.number().optional().default(0),
  isDefault: z.boolean().optional().default(false),
});

export const updateVariantSchema = createVariantSchema.partial().extend({
  availabilityStatus: z.enum(['available', 'out_of_stock']).optional(),
});

export const createAddonSchema = z.object({
  groupName: z.string().min(1, 'Addon group name is required'),
  isRequired: z.boolean().optional().default(false),
  minSelections: z.number().min(0).optional().default(0),
  maxSelections: z.number().min(1).optional().default(5),
  addonItems: z.array(
    z.object({
      name: z.string().min(1, 'Addon item name required'),
      price: z.number().min(0),
      isAvailable: z.boolean().optional().default(true),
    })
  ).min(1, 'At least one addon item is required'),
});

export const updateAddonSchema = createAddonSchema.partial();

export const updateMediaSchema = z.object({
  primaryImageUrl: z.string().url().optional(),
  galleryUrls: z.array(z.string().url()).optional(),
});

export const updateNutritionSchema = z.object({
  calories: z.number().min(0).optional(),
  proteinGrams: z.number().min(0).optional(),
  carbsGrams: z.number().min(0).optional(),
  fatGrams: z.number().min(0).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
});

export const updateAvailabilitySchema = z.object({
  availableDays: z.array(z.string()).optional(),
  timeWindow: z
    .object({
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    })
    .optional(),
  isAvailableAllDay: z.boolean().optional(),
});
