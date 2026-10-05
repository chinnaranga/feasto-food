import { z } from 'zod';

export const addItemToCartSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  basePrice: z.number().min(0, 'Base price cannot be negative'),
  quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
  addons: z
    .array(
      z.object({
        addonId: z.string().optional(),
        name: z.string().min(1),
        price: z.number().min(0),
      })
    )
    .optional()
    .default([]),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const initializeCheckoutSchema = z.object({
  deliveryAddressId: z.string().optional(),
  orderType: z.enum(['delivery', 'pickup', 'dine_in']).optional().default('delivery'),
  tipAmount: z.number().min(0).optional().default(0),
  specialInstructions: z.string().max(300).optional(),
});

export const createOrderSchema = z.object({
  checkoutSessionId: z.string().min(1, 'Checkout session ID is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'placed',
    'accepted',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'rejected',
  ]),
  note: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason required').max(300),
});
