import { create } from 'zustand';
import { aiApi, AIRecommendedFoodCard, AITasteProfile, AICartAction, AICravingIntent } from '@/services/api/aiApi';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  intent?: AICravingIntent;
  recommendations?: AIRecommendedFoodCard[];
  actions?: AICartAction[];
  executionMode?: string;
  timestamp: number;
}

interface AIState {
  isOpen: boolean;
  isThinking: boolean;
  isStreaming: boolean;
  streamingText: string;
  messages: AIMessage[];
  activeRecommendations: AIRecommendedFoodCard[];
  tasteProfile: AITasteProfile | null;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (msg: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  sendChatMessage: (text: string) => Promise<void>;
  fetchTasteProfile: () => Promise<void>;
  clearConversation: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  isOpen: false,
  isThinking: false,
  isStreaming: false,
  streamingText: '',
  messages: [],
  activeRecommendations: [],
  tasteProfile: null,

  setIsOpen: (isOpen) => set({ isOpen }),

  addMessage: (msg) => {
    const newMsg: AIMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
  },

  sendChatMessage: async (text: string) => {
    if (!text.trim()) return;

    const userText = text.trim();
    get().addMessage({ role: 'user', text: userText });
    set({ isThinking: true });

    try {
      const history = get().messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const response = await aiApi.chat({
        message: userText,
        history,
      });

      get().addMessage({
        role: 'assistant',
        text: response.message,
        intent: response.intent,
        recommendations: response.recommendations,
        actions: response.actions,
        executionMode: response.executionMode,
      });

      if (response.recommendations && response.recommendations.length > 0) {
        set({ activeRecommendations: response.recommendations });
      }
    } catch (err) {
      console.warn('[AI Store] Chat error:', err);
      get().addMessage({
        role: 'assistant',
        text: "I'm checking our kitchen availability right now. Try exploring our curated dishes or asking about specific cuisines!",
      });
    } finally {
      set({ isThinking: false });
    }
  },

  fetchTasteProfile: async () => {
    try {
      const profile = await aiApi.getTasteProfile();
      set({ tasteProfile: profile });
    } catch {
      // Guest or not logged in
    }
  },

  clearConversation: () => set({ messages: [], activeRecommendations: [] }),
}));
