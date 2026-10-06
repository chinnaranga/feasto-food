export interface AICravingIntent {
  rawQuery: string;
  detectedTags: string[];
  cuisine: string[];
  dishTypes: string[];
  isVeg: boolean | null;
  dietaryTags: string[];
  spicePreference?: 'mild' | 'medium' | 'hot' | null;
  maxBudget?: number | null;
  mood?: string | null;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'late_night' | 'snack' | null;
  servings?: number;
  summary?: string;
  isNearby?: boolean;
}

export interface AIRecommendedFoodCard {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  image: string;
  price: number;
  rating: number;
  deliveryTime: number;
  distance: string;
  dietaryTags: string[];
  description: string;
  matchReason: string;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  isVeg: boolean;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface AIDiscoveryResponse {
  intent: AICravingIntent;
  recommendations: AIRecommendedFoodCard[];
  reasoning: string;
  confidenceMessage: string;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
  modelLatencyMs: number;
}

export interface AICartAction {
  type: 'add' | 'remove' | 'replace';
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  reason: string;
}

export interface AICartAssistResponse {
  message: string;
  suggestedActions: AICartAction[];
  dietaryVerification?: string;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}

export interface AIRestaurantAssistResponse {
  answer: string;
  suggestedDishIds?: string[];
  suggestedDishes?: AIRecommendedFoodCard[];
  confidence: number;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}

export interface AIOrderAssistResponse {
  message: string;
  suggestedMealCombo: {
    restaurantId: string;
    restaurantName: string;
    totalPrice: number;
    budget: number;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      isVeg: boolean;
    }>;
  };
  reasoning: string;
  requiresUserConfirmation: boolean;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}

export interface AITrackingAssistResponse {
  reply: string;
  orderNumber: string;
  status: string;
  estimatedArrival?: string;
  riderName?: string;
  isDelayed: boolean;
  delayReason?: string;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}

export interface AITasteProfile {
  userId: string;
  topCuisines: Array<{ cuisine: string; orderCount: number; percentage: number }>;
  favoriteDishes: Array<{ name: string; count: number }>;
  dietaryPreferences: string[];
  preferredSpiceLevel: 'mild' | 'medium' | 'hot';
  averageOrderBudget: number;
  typicalOrderTimeOfDay: string;
  totalOrdersAnalyzed: number;
  lastUpdated: string;
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatResponse {
  message: string;
  intent?: AICravingIntent;
  recommendations?: AIRecommendedFoodCard[];
  actions?: AICartAction[];
  requiresConfirmation?: boolean;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}
