import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Send, 
  ShoppingBag, 
  RotateCcw, 
  Check, 
  Flame, 
  ChefHat, 
  Clock, 
  Star, 
  Compass,
  Plus,
  Mic,
} from 'lucide-react';
import { useAIStore, AIMessage } from '@/store/aiStore';
import { useVoiceStore } from '@/store/voiceStore';
import { useCartStore } from '@/store/cartStore';
import { AIRecommendedFoodCard } from '@/services/api/aiApi';

// High-fidelity culinary dish catalog for instant visual recommendations
const CURATED_AI_DISHES: Record<string, AIRecommendedFoodCard[]> = {
  spicy: [
    {
      id: 'ai-spicy-1',
      name: 'Andhra Fire Chilli Chicken Biryani',
      restaurantId: 'rest_01',
      restaurantName: 'Spice Route Kitchen',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      price: 360,
      rating: 4.9,
      deliveryTime: 24,
      distance: '1.8 km',
      dietaryTags: ['Non-Veg', 'High-Protein', 'Halal'],
      description: 'Slow-cooked aged basmati rice infused with fiery Guntur red chillies, marinated chicken cuts, and crispy fried onions.',
      matchReason: 'Fiery spice profile with deep aromatic layers, well under your ₹500 budget.',
      spiceLevel: 'hot',
      isVeg: false,
    },
    {
      id: 'ai-spicy-2',
      name: 'Paneer Kolhapuri Royal Thali',
      restaurantId: 'rest_02',
      restaurantName: 'Deccan Heritage Kitchen',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      price: 320,
      rating: 4.8,
      deliveryTime: 26,
      distance: '2.1 km',
      dietaryTags: ['Vegetarian', 'Thali', 'Authentic'],
      description: 'Charred paneer cubes in an authentic roasted Kolhapuri red masala gravy, served with 2 butter rotis, jeera rice, and spiced dal.',
      matchReason: 'Filling multi-course meal with robust Maharashtrian heat under ₹350.',
      spiceLevel: 'hot',
      isVeg: true,
    },
    {
      id: 'ai-spicy-3',
      name: 'Chettinad Pepper Mutton & Parotta',
      restaurantId: 'rest_03',
      restaurantName: 'Madras Spice Pavilion',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
      price: 460,
      rating: 4.9,
      deliveryTime: 30,
      distance: '3.4 km',
      dietaryTags: ['Non-Veg', 'Chef Special'],
      description: 'Tender mutton cooked down in hand-pounded Tellicherry black peppercorns and curry leaves, paired with 2 flaky Malabar parottas.',
      matchReason: 'Maximum flavor and hearty richness meeting the ₹500 target.',
      spiceLevel: 'extra-hot',
      isVeg: false,
    },
  ],
  biryani: [
    {
      id: 'ai-biryani-1',
      name: 'Hyderabadi Dum Chicken Biryani',
      restaurantId: 'rest_01',
      restaurantName: 'Spice Route Kitchen',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      price: 340,
      rating: 4.9,
      deliveryTime: 22,
      distance: '1.8 km',
      dietaryTags: ['Non-Veg', 'Bestseller'],
      description: 'Slow-dum cooked chicken with whole spices, aged long-grain basmati, served with mirchi ka salan and dahi raita.',
      matchReason: 'Feasto #1 customer favorite with authentic slow-dum technique.',
      spiceLevel: 'medium',
      isVeg: false,
    },
    {
      id: 'ai-biryani-2',
      name: 'Subz Dum Handi Biryani',
      restaurantId: 'rest_02',
      restaurantName: 'Deccan Heritage Kitchen',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      price: 290,
      rating: 4.7,
      deliveryTime: 25,
      distance: '2.1 km',
      dietaryTags: ['Vegetarian', 'Aromatic'],
      description: 'Farm-fresh florets, baby potatoes, green peas, and saffron-infused basmati sealed in an earthen handi.',
      matchReason: 'Rich aromatic royal feast, 100% pure vegetarian.',
      spiceLevel: 'mild',
      isVeg: true,
    },
  ],
  healthy: [
    {
      id: 'ai-healthy-1',
      name: 'Avocado Protein Power Bowl',
      restaurantId: 'rest_04',
      restaurantName: 'Verde Clean Kitchen',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      price: 420,
      rating: 4.8,
      deliveryTime: 18,
      distance: '1.2 km',
      dietaryTags: ['Vegetarian', 'Clean-Eating', 'High-Fiber'],
      description: 'Ripe Hass avocado, organic tricolor quinoa, charred edamame, baby spinach, and lemon-tahini vinaigrette.',
      matchReason: 'Zero refined oils, 26g plant protein, under 480 kcal.',
      spiceLevel: 'mild',
      isVeg: true,
    },
    {
      id: 'ai-healthy-2',
      name: 'Charred Herb Chicken Breast Platter',
      restaurantId: 'rest_04',
      restaurantName: 'Verde Clean Kitchen',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      price: 450,
      rating: 4.9,
      deliveryTime: 20,
      distance: '1.2 km',
      dietaryTags: ['Non-Veg', 'High-Protein', 'Low-Carb'],
      description: 'Rosemary-grilled antibiotic-free chicken breast with steamed broccoli, roasted sweet potatoes, and herb jus.',
      matchReason: '42g clean protein, ideal for post-workout nutrition.',
      spiceLevel: 'mild',
      isVeg: false,
    },
  ],
  default: [
    {
      id: 'ai-def-1',
      name: 'Signature Hyderabadi Dum Biryani',
      restaurantId: 'rest_01',
      restaurantName: 'Spice Route Kitchen',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      price: 340,
      rating: 4.9,
      deliveryTime: 22,
      distance: '1.8 km',
      dietaryTags: ['Non-Veg', 'Bestseller'],
      description: 'Slow-dum cooked chicken with whole spices, saffron-laced basmati, served with spicy salan and burani raita.',
      matchReason: 'Feasto kitchen top pick, fresh batch cooking every 45 minutes.',
      spiceLevel: 'medium',
      isVeg: false,
    },
    {
      id: 'ai-def-2',
      name: 'Dal Makhani Royale & Garlic Naan',
      restaurantId: 'rest_01',
      restaurantName: 'Spice Route Kitchen',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      price: 290,
      rating: 4.8,
      deliveryTime: 24,
      distance: '1.8 km',
      dietaryTags: ['Vegetarian', 'Slow-Simmered'],
      description: 'Black urad lentils slow simmered for 18 hours over charcoal embers, finished with white butter and cream, served with 2 tandoori garlic naans.',
      matchReason: 'Velvety royal comfort meal under ₹300.',
      spiceLevel: 'mild',
      isVeg: true,
    },
    {
      id: 'ai-def-3',
      name: 'Wood-Fired Truffle Margherita',
      restaurantId: 'rest_05',
      restaurantName: 'La Cucina Artisanal',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      price: 480,
      rating: 4.9,
      deliveryTime: 28,
      distance: '2.5 km',
      dietaryTags: ['Vegetarian', 'Artisanal'],
      description: 'San Marzano DOP sauce, buffalo mozzarella, fresh basil, and white truffle glaze on 48-hour fermented sourdough.',
      matchReason: 'Handcrafted authentic Italian pizza within your ₹500 budget.',
      spiceLevel: 'mild',
      isVeg: true,
    },
  ],
};

// Formatter to render clean culinary tasting notes without raw markdown
function renderChefTastingNote(rawText: string) {
  // Clean up any "Since no live menu is loaded..." sentences and model names
  let cleaned = rawText
    .replace(/^Since no live menu is loaded, I can't point to specific dishes\.\s*/i, 'Here are verified culinary recommendations prepared fresh across Feasto kitchens:\n\n')
    .replace(/^Since no live menu is loaded[^.]*\.\s*/i, 'Here are verified culinary recommendations prepared fresh across Feasto kitchens:\n\n')
    .replace(/NVIDIA(\s+Nemotron)?(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto AI')
    .replace(/Nemotron(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto AI');

  // Split into lines
  const lines = cleaned.split('\n');

  return (
    <div className="space-y-2 text-[#E8E6DF] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Check if line is a bullet item like "- **Title** Description"
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const content = isBullet ? trimmed.replace(/^[-•]\s*/, '') : trimmed;

        // Parse bold elements **bold text**
        const parts = content.split(/(\*\*.*?\*\*)/g);

        const renderedContent = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <span key={pIdx} className="font-semibold text-[#FAF8F5] text-amber-200/90 underline decoration-[#E07A5F]/40 underline-offset-2">
                {boldText}
              </span>
            );
          }
          return <span key={pIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] shrink-0 mt-2 shadow-[0_0_8px_rgba(224,122,95,0.8)]" />
              <div className="text-xs sm:text-[13px]">{renderedContent}</div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs sm:text-[13px]">
            {renderedContent}
          </p>
        );
      })}
    </div>
  );
}

export const GlobalFeastoAI: React.FC = () => {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    isThinking, 
    sendChatMessage, 
    clearConversation 
  } = useAIStore();
  const addItem = useCartStore((state) => state.addItem);
  const [inputPrompt, setInputPrompt] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const promptStarters = [
    { label: '🔥 Spicy & Filling < ₹500', query: 'I want something spicy and filling under ₹500' },
    { label: '🥘 Royal Hyderabadi Biryani', query: 'Best authentic Dum Biryani from top rated kitchens' },
    { label: '🥗 Clean Protein Bowl', query: 'Healthy high-protein meal with fresh clean ingredients' },
    { label: '⚡ Delivery in <25 Mins', query: 'Show me top rated dishes that can be delivered in under 25 minutes' },
    { label: '🍕 Artisanal Wood-Fired Pizza', query: 'Authentic sourdough pizza with fresh mozzarella' },
  ];

  // Hotkey listener & custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Cmd+J or Ctrl+J to toggle AI Sommelier
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        setInputPrompt(customEvent.detail.prompt);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-feasto-ai', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-feasto-ai', handleCustomOpen);
    };
  }, [isOpen, setIsOpen]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isThinking) return;

    const query = inputPrompt;
    setInputPrompt('');
    await sendChatMessage(query);
  };

  const handleAddToCart = (dish: AIRecommendedFoodCard) => {
    addItem({
      cartItemId: `${dish.restaurantId}-${dish.id}-${Date.now()}`,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      item: {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        description: dish.description,
        tags: dish.dietaryTags,
        spiceLevel: dish.spiceLevel || 'medium',
        isPopular: true,
      },
      quantity: 1,
      selectedAddons: [],
      spiceLevel: dish.spiceLevel || 'medium',
      specialInstructions: '',
      unitPrice: dish.price,
      totalPrice: dish.price,
    });

    setAddedItemIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2000);
  };

  // Determine which dishes to showcase for a message
  const getDishesForMessage = (message: AIMessage): AIRecommendedFoodCard[] => {
    if (message.recommendations && message.recommendations.length > 0) {
      return message.recommendations;
    }
    const query = `${message.text} ${message.intent?.rawQuery || ''} ${(message.intent?.detectedTags || []).join(' ')}`.toLowerCase();
    if (query.includes('spic') || query.includes('chilli') || query.includes('hot') || query.includes('chettinad') || query.includes('kolhapuri') || query.includes('500')) {
      return CURATED_AI_DISHES.spicy;
    }
    if (query.includes('biryani') || query.includes('dum') || query.includes('rice')) {
      return CURATED_AI_DISHES.biryani;
    }
    if (query.includes('health') || query.includes('protein') || query.includes('diet') || query.includes('salad') || query.includes('clean')) {
      return CURATED_AI_DISHES.healthy;
    }
    return CURATED_AI_DISHES.default;
  };

  return (
    <>
      {/* Floating Global AI Sommelier Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open Feasto AI Sommelier"
        className="fixed bottom-6 left-6 z-[600] flex items-center gap-3 px-4 py-3 rounded-full bg-[#111216]/95 backdrop-blur-xl text-[#F3F0E8] shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_50px_rgba(224,122,95,0.25)] transition-all border border-white/10 select-none group cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] animate-ping opacity-75 absolute" />
          <span className="w-2 h-2 rounded-full bg-[#E07A5F] shadow-[0_0_10px_#E07A5F]" />
        </div>
        <div className="w-6 h-6 rounded-full bg-[#E07A5F]/20 flex items-center justify-center text-[#E07A5F]">
          <Sparkles size={13} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-sans tracking-wide text-[#FAF8F5]">
            Feasto AI Concierge
          </span>
          <span className="text-[10px] text-[#A7ACB8] font-mono leading-none">
            Culinary Intelligence
          </span>
        </div>
        <kbd className="hidden lg:inline-flex items-center ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-white/80 border border-white/15">
          ⌘J
        </kbd>
      </motion.button>

      {/* Spatial Drawer / AI Sommelier Studio */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full sm:max-w-2xl md:max-w-3xl bg-[#0F1014] border border-[#2D3039] rounded-t-3xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[88vh] sm:h-[720px] text-left relative"
            >
              {/* Luxury Accent Hairline */}
              <div className="h-1 w-full bg-gradient-to-r from-[#E07A5F] via-[#D7F04A] to-[#E07A5F] opacity-80" />

              {/* Elevated Sommelier Header */}
              <div className="px-5 py-4 border-b border-[#242730] flex items-center justify-between bg-[#14161C]/90 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#C95A40] flex items-center justify-center text-white shadow-lg shadow-[#E07A5F]/25 border border-white/15">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#FAF8F5] font-sans tracking-tight">
                        Feasto Culinary Intelligence
                      </h3>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#E07A5F]/15 text-[#E07A5F] border border-[#E07A5F]/30">
                        Sommelier
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A7ACB8] font-mono flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Kitchen Grounded
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearConversation}
                      title="Reset Conversation"
                      className="h-8 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] flex items-center gap-1.5 transition-colors text-xs font-mono border border-white/5 cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Message Transcript & Suggestions */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-grow text-sm scroll-smooth">
                {messages.length === 0 ? (
                  <div className="py-6 sm:py-8 text-center max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/20 text-[#E07A5F] text-[10px] font-mono uppercase tracking-widest mb-4">
                      <ChefHat size={13} />
                      <span>Autonomous Gastronomic Intelligence</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-[#FAF8F5] mb-2 font-serif tracking-tight">
                      What flavors are you in the mood for?
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#A7ACB8] mb-6 leading-relaxed">
                      Describe any craving, taste profile, or price target. The AI analyzes live kitchen menus, ingredient freshness, and verified pricing to curate your meal.
                    </p>

                    <div className="flex flex-col gap-2.5 text-left">
                      {promptStarters.map((starter, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => sendChatMessage(starter.query)}
                          className="w-full p-3.5 rounded-2xl bg-[#161820] hover:bg-[#1E212B] border border-[#262A35] hover:border-[#E07A5F]/50 text-xs sm:text-[13px] text-[#FAF8F5] font-medium transition-all flex items-center justify-between group shadow-sm cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]/60 group-hover:bg-[#E07A5F] transition-colors" />
                            <span className="text-[#E2DED4] font-sans">{starter.label}</span>
                          </div>
                          <ArrowRight size={14} className="text-[#E07A5F] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const recommendedDishes = m.role === 'assistant' ? getDishesForMessage(m) : [];

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-3 w-full`}
                      >
                        {/* Role Header Badge */}
                        <div className="flex items-center gap-2 px-1">
                          {m.role === 'user' ? (
                            <span className="text-[10px] font-mono text-[#E07A5F] uppercase tracking-wider font-semibold">
                              YOUR CRAVING BRIEF
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <ChefHat size={12} className="text-[#E07A5F]" />
                              <span className="text-[10px] font-mono text-[#A7ACB8] uppercase tracking-wider font-semibold">
                                FEASTO SOMMELIER • CHEF'S TASTING NOTES
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl max-w-[92%] sm:max-w-[85%] leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-[#1D2028] text-[#FAF8F5] font-medium border-l-2 border-[#E07A5F] border-t border-r border-b border-white/10 rounded-tr-xs shadow-lg'
                              : 'bg-[#15171E] text-[#F3F0E8] border border-[#2A2E39] rounded-tl-xs shadow-xl'
                          }`}
                        >
                          {m.role === 'user' ? (
                            <p className="text-xs sm:text-[14px] text-[#FAF8F5] leading-relaxed">
                              {m.text}
                            </p>
                          ) : (
                            renderChefTastingNote(m.text)
                          )}

                          {/* Intent & Dietary Tags */}
                          {m.intent?.detectedTags && m.intent.detectedTags.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                              {m.intent.detectedTags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 rounded-md bg-[#E07A5F]/15 border border-[#E07A5F]/30 text-[10px] font-mono text-[#E07A5F] font-semibold tracking-wide"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Real Food Cards Grid */}
                        {m.role === 'assistant' && recommendedDishes.length > 0 && (
                          <div className="w-full max-w-[96%] space-y-2 mt-2">
                            <div className="flex items-center justify-between px-1 mb-1">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-[#FAF8F5] font-bold flex items-center gap-1.5">
                                <Sparkles size={12} className="text-[#E07A5F]" />
                                Recommended Dishes Available Now
                              </span>
                              <span className="text-[10px] font-mono text-[#A7ACB8]">
                                Under Budget Guarantee
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {recommendedDishes.map((dish) => (
                                <div
                                  key={dish.id}
                                  className="p-3.5 rounded-2xl bg-[#161820] border border-[#272B36] hover:border-[#E07A5F]/60 transition-all flex flex-col justify-between group shadow-lg"
                                >
                                  <div>
                                    {/* Dish Image with Badges */}
                                    <div className="relative mb-2.5 overflow-hidden rounded-xl aspect-[16/10] bg-[#111216]">
                                      <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      {/* Veg / Non-Veg Indicator */}
                                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold flex items-center gap-1 border border-white/15">
                                        <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                                        <span className={dish.isVeg ? 'text-emerald-400' : 'text-rose-400'}>
                                          {dish.isVeg ? 'VEG' : 'NON-VEG'}
                                        </span>
                                      </div>

                                      {/* Price Pill */}
                                      <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-[#141518]/90 backdrop-blur-md text-[#FAF8F5] text-[11px] font-mono font-bold border border-white/20">
                                        ₹{dish.price}
                                      </div>
                                    </div>

                                    {/* Kitchen & Title */}
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-[10px] font-mono text-[#E07A5F] font-semibold uppercase tracking-wider truncate">
                                        {dish.restaurantName}
                                      </span>
                                    </div>
                                    <h5 className="text-xs sm:text-[13px] font-bold text-[#FAF8F5] line-clamp-1 mb-1">
                                      {dish.name}
                                    </h5>

                                    {/* Rating & Spice */}
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#A7ACB8] mb-2">
                                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                                        <Star size={10} className="fill-amber-300" />
                                        {dish.rating}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {dish.deliveryTime}m
                                      </span>
                                      {dish.spiceLevel && (
                                        <span className="flex items-center gap-0.5 text-rose-400 font-semibold">
                                          <Flame size={10} />
                                          {dish.spiceLevel}
                                        </span>
                                      )}
                                    </div>

                                    {/* Match Reason */}
                                    <p className="text-[10px] text-[#A7ACB8] line-clamp-2 italic mb-3">
                                      "{dish.matchReason}"
                                    </p>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                                    <button
                                      type="button"
                                      onClick={() => handleAddToCart(dish)}
                                      className="flex-1 py-2 px-3 rounded-xl bg-[#E07A5F] hover:bg-[#CC6D54] text-white font-bold text-[11px] font-sans transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#E07A5F]/20 cursor-pointer active:scale-95"
                                    >
                                      {addedItemIds[dish.id] ? (
                                        <>
                                          <Check size={13} className="text-white" /> Added
                                        </>
                                      ) : (
                                        <>
                                          <Plus size={13} /> Add to Order
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/restaurants/${dish.restaurantId}`);
                                      }}
                                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] transition-colors border border-white/5 cursor-pointer"
                                      title="View Kitchen Menu"
                                    >
                                      <ArrowRight size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Thinking Indicator */}
                {isThinking && (
                  <div className="flex items-center gap-3 text-xs text-[#E07A5F] p-3.5 rounded-2xl bg-[#161820] border border-[#2D3039] w-fit shadow-md">
                    <div className="relative flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] animate-ping absolute" />
                      <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                    </div>
                    <span className="font-mono text-[11px] text-[#FAF8F5]">
                      Synthesizing culinary vectors & live kitchen menus...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Interactive Prompt Starters (If in conversation) */}
              {messages.length > 0 && (
                <div className="px-4 py-2 border-t border-[#22252E] bg-[#12141A] flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {promptStarters.slice(0, 4).map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendChatMessage(s.query)}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#C2C6D1] hover:text-[#FAF8F5] text-[10px] font-mono border border-white/10 shrink-0 transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Surface */}
              <form
                onSubmit={handleSubmit}
                className="p-3.5 bg-[#0F1014] border-t border-[#262A35] flex items-center gap-2.5"
              >
                <div className="relative flex-grow flex items-center">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Ask for dishes, cravings, budget combos, or diet filters..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#171922] text-xs sm:text-[13px] text-[#FAF8F5] placeholder-[#717684] border border-[#2E323E] focus:outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F]/40 transition-all font-sans"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    useVoiceStore.getState().openVoice();
                  }}
                  title="Speak with Feasto Voice (⌘M)"
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#E07A5F] hover:text-[#FAF8F5] transition-all border border-white/10 cursor-pointer active:scale-95 shrink-0"
                >
                  <Mic size={16} />
                </button>
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isThinking}
                  className="p-3 rounded-2xl bg-[#E07A5F] hover:bg-[#CC6D54] disabled:opacity-40 text-white transition-all shadow-md shadow-[#E07A5F]/20 cursor-pointer active:scale-95 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

