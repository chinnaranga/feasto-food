import { apiClient } from './client';
import { AIRecommendedFoodCard } from './aiApi';

export interface VoiceContextPayload {
  currentPage?: string;
  currentRoute?: string;
  currentRestaurant?: { id: string; name: string };
  currentMenu?: any[];
  currentCart?: {
    restaurantId?: string;
    restaurantName?: string;
    totalPrice: number;
    itemCount: number;
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
  };
  currentOrder?: {
    orderId?: string;
    orderNumber?: string;
    status?: string;
    estimatedArrival?: string;
  };
  userPreferences?: {
    isVeg?: boolean;
    favoriteCuisines?: string[];
    spicePreference?: string;
  };
  recentConversation?: Array<{ role: 'user' | 'assistant'; content: string }>;
  time?: string;
}

export interface VoiceToolCall {
  tool: string;
  arguments: Record<string, any>;
  result?: any;
  requiresConfirmation?: boolean;
}

export interface VoiceRespondResponse {
  spokenResponse: string;
  displayText: string;
  toolAction?: VoiceToolCall;
  visualResults?: AIRecommendedFoodCard[];
  suggestedFollowUps?: string[];
  executionMode: 'nemotron_live' | 'deterministic_fallback';
  modelLatencyMs: number;
}

export interface VoiceSessionInfo {
  status: 'ready' | 'degraded';
  model: string;
  supportedLanguages: Array<{ code: string; label: string }>;
  availableTools: string[];
  streamingSupported: boolean;
}

export const voiceApi = {
  /**
   * Fetch active voice session info, supported languages, and tool registry.
   */
  async getSession(): Promise<VoiceSessionInfo> {
    return apiClient.get<VoiceSessionInfo>('/ai/voice/session');
  },

  /**
   * Primary voice reasoning and tool invocation endpoint.
   */
  async respond(data: {
    transcript: string;
    context?: VoiceContextPayload;
    language?: string;
  }): Promise<VoiceRespondResponse> {
    return apiClient.post<VoiceRespondResponse>('/ai/voice/respond', data);
  },

  /**
   * Audio transcription verification.
   */
  async transcribe(data: {
    transcript?: string;
    language?: string;
  }): Promise<{ transcript: string; language: string }> {
    return apiClient.post<{ transcript: string; language: string }>('/ai/voice/transcribe', data);
  },
};
