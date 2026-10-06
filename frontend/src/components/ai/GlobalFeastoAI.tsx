import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Send, 
  MapPin, 
  ShoppingBag,
  Star,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';
import { useAIStore } from '@/store/aiStore';
import { useCartStore } from '@/store/cartStore';

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

  const defaultPromptExamples = [
    'I want something spicy and filling under ₹500',
    'Best authentic biryani in Hyderabad right now',
    'Healthy high-protein dinner with clean ingredients',
    'Comforting vegetarian meal for two people',
  ];

  // Hotkey listener (Cmd+K / Ctrl+K) & custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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

  // Auto-scroll to bottom of messages
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

  const handleAddToCart = (dish: any) => {
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

  return (
    <>
      {/* Floating Global AI Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open Feasto AI Companion"
        className="fixed bottom-6 left-6 z-[600] flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#141518] text-[#F3F0E8] font-bold text-xs shadow-2xl shadow-black/40 hover:bg-[#202228] transition-all border border-[#2D3039] select-none group cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#E07A5F] shadow-xs shadow-[#E07A5F] animate-pulse" />
        <Sparkles size={15} className="text-[#E07A5F]" />
        <span className="tracking-wide font-sans font-semibold">Ask Feasto AI</span>
        <span className="hidden md:inline text-[10px] text-[#A7ACB8] font-mono border-l border-white/20 pl-2">
          Nemotron 550B
        </span>
        <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-white/80 border border-white/15">
          ⌘K
        </kbd>
      </motion.button>

      {/* Spatial Drawer / Assistant Surface */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full sm:max-w-2xl bg-[#141518] border border-[#2D3039] rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col h-[85vh] sm:h-[680px] text-left"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#2D3039] flex items-center justify-between bg-[#1B1D22]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E07A5F]/20 border border-[#E07A5F]/40 flex items-center justify-center text-[#E07A5F]">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F3F0E8] font-sans tracking-tight">
                      Feasto Culinary Intelligence
                    </h3>
                    <p className="text-[11px] text-[#A7ACB8] font-mono flex items-center gap-1.5">
                      <span>NVIDIA Nemotron 3 Ultra 550B</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Live</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearConversation}
                      title="Clear Conversation"
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#F3F0E8] flex items-center justify-center transition-colors text-xs"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#F3F0E8] flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Message Transcript & Suggestions */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-grow text-sm">
                {messages.length === 0 ? (
                  <div className="py-6 text-center max-w-lg mx-auto">
                    <p className="text-xs font-mono text-[#A7ACB8] uppercase tracking-wider mb-3">
                      Autonomous Food Discovery & Ordering
                    </p>
                    <h4 className="text-lg font-bold text-[#F3F0E8] mb-2 font-serif">
                      What are you in the mood for?
                    </h4>
                    <p className="text-xs text-[#A7ACB8] mb-6 leading-relaxed">
                      Describe any craving, dietary requirement, or meal budget. The AI reasons over live kitchen menus and delivers real verified recommendations.
                    </p>

                    <div className="flex flex-col gap-2 text-left">
                      {defaultPromptExamples.map((ex, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => sendChatMessage(ex)}
                          className="w-full p-3 rounded-xl bg-[#1B1D22] hover:bg-[#252830] border border-[#2D3039] text-xs text-[#F3F0E8] font-medium transition-all flex items-center justify-between group"
                        >
                          <span className="text-[#E2DED4]">"{ex}"</span>
                          <ArrowRight size={13} className="text-[#E07A5F] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-2.5`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] max-w-[88%] leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-[#E07A5F] text-white font-medium rounded-br-xs'
                            : 'bg-[#1B1D22] text-[#F3F0E8] border border-[#2D3039] rounded-bl-xs'
                        }`}
                      >
                        {m.text}

                        {/* Intent Tags */}
                        {m.intent?.detectedTags && m.intent.detectedTags.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                            {m.intent.detectedTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#E2DED4]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Attached Real Recommendations */}
                      {m.recommendations && m.recommendations.length > 0 && (
                        <div className="w-full max-w-[94%] grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                          {m.recommendations.map((dish) => (
                            <div
                              key={dish.id}
                              className="p-3 rounded-2xl bg-[#191B20] border border-[#2D3039] hover:border-[#E07A5F]/50 transition-all flex flex-col justify-between"
                            >
                              <div className="flex gap-2.5 mb-2">
                                <img
                                  src={dish.image}
                                  alt={dish.name}
                                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-[10px] font-mono text-[#E07A5F] uppercase truncate">
                                      {dish.restaurantName}
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-[#F3F0E8] truncate">
                                    {dish.name}
                                  </h5>
                                  <p className="text-[11px] font-mono font-bold text-white mt-1">
                                    ₹{dish.price}
                                  </p>
                                </div>
                              </div>

                              <p className="text-[10px] text-[#A7ACB8] line-clamp-2 italic mb-2.5">
                                "{dish.matchReason}"
                              </p>

                              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(dish)}
                                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#E07A5F] hover:bg-[#CC6D54] text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                                >
                                  {addedItemIds[dish.id] ? (
                                    <>
                                      <Check size={12} /> Added
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag size={12} /> Add to Cart
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/restaurants/${dish.restaurantId}`);
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-white transition-colors"
                                  title="View Restaurant"
                                >
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Thinking Indicator */}
                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-[#E07A5F] p-3 rounded-2xl bg-[#1B1D22] border border-[#2D3039] w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-ping" />
                    <span className="font-mono text-[11px]">NVIDIA Nemotron synthesizing culinary vectors...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Surface */}
              <form
                onSubmit={handleSubmit}
                className="p-3 bg-[#111216] border-t border-[#2D3039] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask for dishes, diet filters, combos, or pairings..."
                  className="flex-grow px-4 py-2.5 rounded-xl bg-[#1B1D22] text-xs sm:text-[13px] text-[#F3F0E8] placeholder-[#6F7480] border border-[#2D3039] focus:outline-none focus:border-[#E07A5F] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isThinking}
                  className="p-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#CC6D54] disabled:opacity-40 text-white transition-colors"
                >
                  <Send size={15} />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
