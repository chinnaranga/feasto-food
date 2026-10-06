import { z } from 'zod';

// --- Client Request Schemas ---

export const discoverFoodSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(500, 'Prompt too long'),
  location: z.object({
    city: z.string().optional().default('Hyderabad'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
});

export const searchAISchema = z.object({
  query: z.string().min(1, 'Search query is required').max(300),
  location: z.object({
    city: z.string().optional().default('Hyderabad'),
  }).optional(),
});

export const recommendAISchema = z.object({
  city: z.string().optional().default('Hyderabad'),
  limit: z.number().int().min(1).max(20).optional().default(6),
});

export const cartAssistSchema = z.object({
  instruction: z.string().min(1, 'Instruction is required').max(300),
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  cartItems: z.array(
    z.object({
      itemId: z.string(),
      itemName: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      isVeg: z.boolean().optional(),
    })
  ).min(1, 'Cart items are required'),
});

export const restaurantAssistSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  question: z.string().min(1, 'Question is required').max(400),
});

export const orderAssistSchema = z.object({
  budget: z.number().positive().max(50000, 'Budget too high'),
  peopleCount: z.number().int().min(1).max(20).default(2),
  cuisinePreference: z.string().optional(),
  restaurantId: z.string().optional(),
  isVegOnly: z.boolean().optional(),
});

export const trackingAssistSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  question: z.string().min(1, 'Question is required').max(300),
});

export const chatAISchema = z.object({
  message: z.string().min(1, 'Message is required').max(600),
  history: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ).optional().default([]),
  context: z.record(z.unknown()).optional(),
});

// --- NVIDIA Nemotron Raw LLM Output Parsers ---

export const rawNemotronIntentSchema = z.object({
  detectedTags: z.array(z.string()).default([]),
  cuisine: z.array(z.string()).default([]),
  dishTypes: z.array(z.string()).default([]),
  isVeg: z.boolean().nullable().optional(),
  dietaryTags: z.array(z.string()).default([]),
  spicePreference: z.enum(['mild', 'medium', 'hot']).nullable().optional(),
  maxBudget: z.number().nullable().optional(),
  mood: z.string().nullable().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'late_night', 'snack']).nullable().optional(),
  servings: z.number().optional().default(1),
  summary: z.string().optional(),
});

export const rawNemotronSynthesisSchema = z.object({
  reasoning: z.string().default(''),
  confidenceMessage: z.string().default('Verified against live kitchen availability'),
  itemReasons: z.record(z.string()).default({}),
});

export const rawNemotronCartAssistSchema = z.object({
  message: z.string(),
  suggestedActions: z.array(
    z.object({
      type: z.enum(['add', 'remove', 'replace']),
      itemId: z.string(),
      itemName: z.string(),
      price: z.number().default(0),
      quantity: z.number().default(1),
      reason: z.string(),
    })
  ).default([]),
  dietaryVerification: z.string().optional(),
});

export const rawNemotronRecommenderSchema = z.object({
  headline: z.string().default('Handpicked for your palate'),
  recommendations: z.array(
    z.object({
      dishId: z.string(),
      personalizedReason: z.string(),
      confidenceScore: z.number().default(90),
    })
  ).default([]),
});

// --- Voice Assistant Request Schemas ---
export const voiceRespondSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty').max(1000),
  context: z
    .object({
      currentPage: z.string().optional(),
      currentRoute: z.string().optional(),
      currentRestaurant: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .optional(),
      currentMenu: z.array(z.any()).optional(),
      currentCart: z
        .object({
          restaurantId: z.string().optional(),
          restaurantName: z.string().optional(),
          totalPrice: z.number().default(0),
          itemCount: z.number().default(0),
          items: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
              })
            )
            .default([]),
        })
        .optional(),
      currentOrder: z
        .object({
          orderId: z.string().optional(),
          orderNumber: z.string().optional(),
          status: z.string().optional(),
          estimatedArrival: z.string().optional(),
        })
        .optional(),
      userPreferences: z
        .object({
          isVeg: z.boolean().optional(),
          favoriteCuisines: z.array(z.string()).optional(),
          spicePreference: z.string().optional(),
        })
        .optional(),
      recentConversation: z
        .array(
          z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
          })
        )
        .optional(),
      time: z.string().optional(),
    })
    .optional(),
  language: z.string().default('en-IN'),
});

export const voiceTranscribeSchema = z.object({
  audioBase64: z.string().optional(),
  mimeType: z.string().optional(),
  transcript: z.string().optional(),
  language: z.string().default('en-IN'),
});
