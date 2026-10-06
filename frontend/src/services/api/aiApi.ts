import { apiClient } from './client';
import { env } from '@/config/env';

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

export interface AIChatResponse {
  message: string;
  intent?: AICravingIntent;
  recommendations?: AIRecommendedFoodCard[];
  actions?: AICartAction[];
  requiresConfirmation?: boolean;
  executionMode: 'nemotron_live' | 'deterministic_fallback';
}

export interface AIHealthStatus {
  provider: string;
  model: string;
  nemotronAvailable: boolean;
  status: 'operational' | 'degraded_deterministic_fallback';
}

export const aiApi = {
  /**
   * Health & readiness of backend Nemotron AI service.
   */
  async getHealth(): Promise<AIHealthStatus> {
    return apiClient.get<AIHealthStatus>('/ai/health');
  },

  /**
   * AI Food Discovery: translates natural language craving into precision dishes.
   */
  async discover(data: {
    prompt: string;
    location?: { city?: string; latitude?: number; longitude?: number };
  }): Promise<AIDiscoveryResponse> {
    return apiClient.post<AIDiscoveryResponse>('/ai/discover', data);
  },

  /**
   * Upgraded Natural Language Search.
   */
  async search(data: { query: string; location?: { city?: string } }) {
    return apiClient.post('/ai/search', data);
  },

  /**
   * Explainable Recommendations tailored to user taste profile.
   */
  async recommend(data: { city?: string; limit?: number } = {}) {
    return apiClient.post<{
      headline: string;
      dishes: AIRecommendedFoodCard[];
      executionMode: string;
    }>('/ai/recommend', data);
  },

  /**
   * AI Cart Assistant: suggestions, diet modifications, or pairing recommendations.
   */
  async cartAssist(data: {
    instruction: string;
    restaurantId: string;
    cartItems: Array<{
      itemId: string;
      itemName: string;
      price: number;
      quantity: number;
      isVeg?: boolean;
    }>;
  }): Promise<AICartAssistResponse> {
    return apiClient.post<AICartAssistResponse>('/ai/cart-assist', data);
  },

  /**
   * AI Restaurant Sommelier: answers questions about specific restaurant's menu.
   */
  async restaurantAssist(data: {
    restaurantId: string;
    question: string;
  }): Promise<AIRestaurantAssistResponse> {
    return apiClient.post<AIRestaurantAssistResponse>('/ai/restaurant-assist', data);
  },

  /**
   * AI Order Combo Planner: builds balanced meal within target budget.
   */
  async orderAssist(data: {
    budget: number;
    peopleCount: number;
    cuisinePreference?: string;
    restaurantId?: string;
    isVegOnly?: boolean;
  }): Promise<AIOrderAssistResponse> {
    return apiClient.post<AIOrderAssistResponse>('/ai/order-assist', data);
  },

  /**
   * AI Order Tracking Telemetry Assistant.
   */
  async trackingAssist(data: {
    orderId: string;
    question: string;
  }): Promise<AITrackingAssistResponse> {
    return apiClient.post<AITrackingAssistResponse>('/ai/tracking-assist', data);
  },

  /**
   * Fetch authenticated user's taste profile.
   */
  async getTasteProfile(): Promise<AITasteProfile> {
    return apiClient.get<AITasteProfile>('/ai/taste-profile');
  },

  /**
   * Conversational culinary chat with memory.
   */
  async chat(data: {
    message: string;
    history?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  }): Promise<AIChatResponse> {
    return apiClient.post<AIChatResponse>('/ai/chat', data);
  },

  /**
   * Real-time Server-Sent Events (SSE) streaming chat.
   */
  async streamChat(
    data: {
      message: string;
      history?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    },
    callbacks: {
      onChunk: (chunk: string) => void;
      onComplete?: () => void;
      onError?: (err: Error) => void;
      signal?: AbortSignal;
    }
  ): Promise<void> {
    const url = `${env.VITE_API_BASE_URL}/ai/stream`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: callbacks.signal,
        credentials: 'include',
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming failed: HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const clean = line.trim();
          if (!clean.startsWith('data:')) continue;
          const dataStr = clean.replace(/^data:\s*/, '').trim();
          if (dataStr === '[DONE]') {
            callbacks.onComplete?.();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              callbacks.onChunk(parsed.text);
            }
          } catch {
            // Wait for full chunk
          }
        }
      }

      callbacks.onComplete?.();
    } catch (err: unknown) {
      if (callbacks.signal?.aborted) return;
      callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  },
};
