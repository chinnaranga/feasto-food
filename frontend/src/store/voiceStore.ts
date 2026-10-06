import { create } from 'zustand';
import { VoiceManager, VoiceState } from '@/services/voice/VoiceManager';
import { getActiveVoiceContext } from '@/services/voice/voiceContext';
import { voiceApi, VoiceToolCall } from '@/services/api/voiceApi';
import { AIRecommendedFoodCard } from '@/services/api/aiApi';
import { useCartStore } from './cartStore';

export interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  spokenText?: string;
  visualResults?: AIRecommendedFoodCard[];
  toolAction?: VoiceToolCall;
  timestamp: number;
}

interface VoiceStoreState {
  isOpen: boolean;
  state: VoiceState;
  interimTranscript: string;
  finalTranscript: string;
  spokenResponse: string;
  displayText: string;
  audioLevel: number;
  selectedLanguage: string;
  errorMessage: string | null;
  visualResults: AIRecommendedFoodCard[];
  suggestedFollowUps: string[];
  lastToolAction: VoiceToolCall | null;
  conversationHistory: VoiceMessage[];

  // Actions
  openVoice: () => void;
  closeVoice: () => void;
  toggleVoice: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  interrupt: () => void;
  submitTranscript: (transcript: string) => Promise<void>;
  setLanguage: (lang: string) => void;
  clearConversation: () => void;
}

let voiceManagerInstance: VoiceManager | null = null;

function getVoiceManager(set: any, get: any): VoiceManager {
  if (!voiceManagerInstance) {
    voiceManagerInstance = new VoiceManager({
      onStateChange: (state) => set({ state }),
      onInterimTranscript: (interimTranscript) => set({ interimTranscript }),
      onFinalTranscript: async (finalTranscript) => {
        set({ finalTranscript, interimTranscript: '' });
        if (finalTranscript.trim()) {
          await get().submitTranscript(finalTranscript);
        }
      },
      onAudioLevel: (audioLevel) => set({ audioLevel }),
      onError: (errorMessage) => set({ errorMessage, state: 'ERROR' }),
    });
  }
  return voiceManagerInstance;
}

export const useVoiceStore = create<VoiceStoreState>((set, get) => ({
  isOpen: false,
  state: 'IDLE',
  interimTranscript: '',
  finalTranscript: '',
  spokenResponse: '',
  displayText: '',
  audioLevel: 0,
  selectedLanguage: 'en-IN',
  errorMessage: null,
  visualResults: [],
  suggestedFollowUps: [
    'Find something spicy under ₹400',
    'Best authentic biryani near Indiranagar',
    'What is good at this kitchen?',
    'Healthy high-protein meal',
  ],
  lastToolAction: null,
  conversationHistory: [],

  openVoice: () => {
    set({ isOpen: true, errorMessage: null });
    get().startListening();
  },

  closeVoice: () => {
    const vm = getVoiceManager(set, get);
    vm.stopListening();
    vm.cancelSpeech();
    set({ isOpen: false, state: 'IDLE', interimTranscript: '', audioLevel: 0 });
  },

  toggleVoice: () => {
    if (get().isOpen) {
      get().closeVoice();
    } else {
      get().openVoice();
    }
  },

  startListening: async () => {
    const vm = getVoiceManager(set, get);
    set({ errorMessage: null });
    const started = await vm.startListening();
    if (!started) {
      const state = vm.getState();
      set({ state });
    }
  },

  stopListening: () => {
    const vm = getVoiceManager(set, get);
    vm.stopListening();
  },

  interrupt: () => {
    const vm = getVoiceManager(set, get);
    vm.handleInterruption();
    set({ state: 'INTERRUPTED' });
  },

  submitTranscript: async (transcript: string) => {
    const text = transcript.trim();
    if (!text) return;

    const vm = getVoiceManager(set, get);
    vm.setThinking();
    set({ state: 'THINKING', finalTranscript: text, interimTranscript: '' });

    // Add user turn to conversation history
    const userMsg: VoiceMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    set((s) => ({ conversationHistory: [...s.conversationHistory, userMsg] }));

    try {
      // Gather active application context
      const historyContext = get().conversationHistory.slice(-4).map((m) => ({
        role: m.role,
        content: m.text,
      }));
      const activeContext = getActiveVoiceContext(historyContext);

      const response = await voiceApi.respond({
        transcript: text,
        context: activeContext,
        language: get().selectedLanguage,
      });

      // Handle structured tool execution
      if (response.toolAction) {
        set({ lastToolAction: response.toolAction });

        if (response.toolAction.tool === 'addToCart' && response.toolAction.arguments) {
          const args = response.toolAction.arguments;
          useCartStore.getState().addItem({
            cartItemId: `${args.restaurantId || 'rest'}-${args.itemId}-${Date.now()}`,
            restaurantId: args.restaurantId || 'rest-01',
            restaurantName: args.restaurantName || 'Verified Kitchen',
            item: {
              id: args.itemId,
              name: args.itemName || 'Curated Dish',
              price: args.price || 300,
              description: '',
              tags: ['Recommended'],
              spiceLevel: 'medium',
              isPopular: true,
            },
            quantity: args.quantity || 1,
            selectedAddons: [],
            spiceLevel: 'medium',
            specialInstructions: '',
            unitPrice: args.price || 300,
            totalPrice: (args.price || 300) * (args.quantity || 1),
          });
        }

        if (response.toolAction.tool === 'navigatePage' && response.toolAction.arguments?.route) {
          setTimeout(() => {
            window.location.pathname = response.toolAction!.arguments.route;
          }, 1800);
        }
      }

      // Add assistant turn to conversation history
      const assistantMsg: VoiceMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        text: response.displayText,
        spokenText: response.spokenResponse,
        visualResults: response.visualResults,
        toolAction: response.toolAction,
        timestamp: Date.now(),
      };

      set({
        spokenResponse: response.spokenResponse,
        displayText: response.displayText,
        visualResults: response.visualResults || [],
        suggestedFollowUps: response.suggestedFollowUps || [],
        conversationHistory: [...get().conversationHistory, assistantMsg],
      });

      // Playback natural spoken response via TTS
      await vm.speak(
        response.spokenResponse,
        () => set({ state: 'SPEAKING' }),
        () => {
          if (get().isOpen) {
            // Keep listening for continuous voice conversation
            vm.startListening();
          }
        }
      );
    } catch (err: any) {
      console.warn('[Feasto Voice] Conversation error:', err);
      const fallbackSpoken = "I found our freshest kitchen specials on your screen.";
      set({
        state: 'IDLE',
        displayText: "Checking live kitchens right now. You can explore our verified menu catalog or tap any item to order.",
        spokenResponse: fallbackSpoken,
      });
      await vm.speak(fallbackSpoken);
    }
  },

  setLanguage: (lang: string) => {
    set({ selectedLanguage: lang });
    const vm = getVoiceManager(set, get);
    vm.setLanguage(lang);
  },

  clearConversation: () => {
    set({
      conversationHistory: [],
      visualResults: [],
      interimTranscript: '',
      finalTranscript: '',
      spokenResponse: '',
      displayText: '',
      lastToolAction: null,
    });
  },
}));
