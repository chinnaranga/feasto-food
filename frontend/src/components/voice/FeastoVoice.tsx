import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  RotateCcw,
  Globe,
  Star,
  Clock,
  Flame,
  AlertCircle
} from 'lucide-react';
import { useVoiceStore } from '@/store/voiceStore';
import { useCartStore } from '@/store/cartStore';
import { AIRecommendedFoodCard } from '@/services/api/aiApi';

export const FeastoVoice: React.FC = () => {
  const {
    isOpen,
    state,
    interimTranscript,
    finalTranscript,
    spokenResponse,
    displayText,
    audioLevel,
    selectedLanguage,
    errorMessage,
    visualResults,
    suggestedFollowUps,
    closeVoice,
    startListening,
    stopListening,
    interrupt,
    submitTranscript,
    setLanguage,
    clearConversation,
  } = useVoiceStore();

  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Global hotkey: ⌘M or Ctrl+M to toggle voice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        useVoiceStore.getState().toggleVoice();
      }
      if (e.key === 'Escape' && useVoiceStore.getState().isOpen) {
        closeVoice();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeVoice]);

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

    setAddedIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 2000);
  };

  if (!isOpen) return null;

  const currentDisplayTitle = () => {
    switch (state) {
      case 'LISTENING':
        return interimTranscript || finalTranscript ? `"${interimTranscript || finalTranscript}"` : 'Listening to your craving...';
      case 'THINKING':
        return 'Consulting verified kitchens & menus...';
      case 'SPEAKING':
        return displayText || spokenResponse || 'Feasto is answering...';
      case 'INTERRUPTED':
        return 'Listening...';
      case 'PERMISSION_REQUIRED':
        return 'Microphone permission required';
      case 'ERROR':
        return errorMessage || 'Voice unavailable right now';
      default:
        return 'What are you in the mood for?';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-3xl bg-[#0F1014] text-[#F3F0E8] border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] relative"
        >
          {/* Subtle Top Accent Hairline */}
          <div className="h-1 w-full bg-gradient-to-r from-[#E07A5F] via-[#D7F04A] to-[#E07A5F] opacity-75" />

          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#15171E]/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/30 flex items-center justify-center shadow-xs">
                <Mic size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-[#FAF8F5] font-sans">
                    FEASTO VOICE
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#E07A5F]/15 text-[#E07A5F] border border-[#E07A5F]/30">
                    Real-time
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#A7ACB8] mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="uppercase tracking-wider font-semibold">
                    {state === 'LISTENING' && 'Listening'}
                    {state === 'THINKING' && 'Synthesizing'}
                    {state === 'SPEAKING' && 'Speaking'}
                    {state === 'INTERRUPTED' && 'Barge-In Active'}
                    {state === 'IDLE' && 'Ready'}
                    {state === 'PERMISSION_REQUIRED' && 'Mic Blocked'}
                    {state === 'ERROR' && 'Notice'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative flex items-center">
                <Globe size={13} className="text-[#A7ACB8] absolute left-2.5 pointer-events-none" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#E2DED4] rounded-xl pl-7 pr-3 py-1.5 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="en-IN" className="bg-[#15171E] text-white">English (India)</option>
                  <option value="en-US" className="bg-[#15171E] text-white">English (US)</option>
                  <option value="hi-IN" className="bg-[#15171E] text-white">Hindi (हिंदी)</option>
                  <option value="te-IN" className="bg-[#15171E] text-white">Telugu (తెలుగు)</option>
                </select>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={clearConversation}
                title="Reset Turn"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={closeVoice}
                aria-label="Close Voice Assistant"
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Central Voice Canvas */}
          <div className="p-6 sm:p-8 flex-grow overflow-y-auto space-y-6 text-center">
            {/* Permission Denied Banner */}
            {state === 'PERMISSION_REQUIRED' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm text-left flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h5 className="font-bold mb-1">Microphone Access Required</h5>
                  <p className="text-amber-200/80 leading-relaxed mb-2">
                    Please allow microphone access in your browser address bar to speak with Feasto Voice.
                  </p>
                  <button
                    type="button"
                    onClick={() => startListening()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Grant Permission & Retry
                  </button>
                </div>
              </div>
            )}

            {/* Editorial Headline / Active Thought */}
            <div className="min-h-[90px] flex flex-col items-center justify-center max-w-xl mx-auto">
              <motion.h2
                key={state + currentDisplayTitle()}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`font-serif text-xl sm:text-2xl sm:leading-snug tracking-tight ${
                  state === 'LISTENING'
                    ? 'text-[#FAF8F5] italic'
                    : state === 'SPEAKING'
                    ? 'text-amber-100/90 font-medium'
                    : 'text-[#E2DED4]'
                }`}
              >
                {currentDisplayTitle()}
              </motion.h2>

              {/* Barge-in Notice during speaking */}
              {state === 'SPEAKING' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={interrupt}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-mono text-[#FAF8F5] transition-colors cursor-pointer border border-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-ping" />
                  <span>Tap or speak to interrupt (Barge-in)</span>
                </motion.button>
              )}
            </div>

            {/* Tactile Acoustic Waveform Visualizer */}
            <div className="py-2 flex items-center justify-center gap-1.5 h-12">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                const heightMult = state === 'LISTENING'
                  ? Math.max(0.18, audioLevel * (0.4 + (idx % 3) * 0.35))
                  : state === 'SPEAKING'
                  ? 0.35 + Math.sin(Date.now() / 200 + idx) * 0.25
                  : state === 'THINKING'
                  ? 0.2
                  : 0.12;

                return (
                  <motion.div
                    key={idx}
                    animate={{ height: `${Math.max(6, heightMult * 44)}px` }}
                    transition={{ duration: 0.08, ease: 'linear' }}
                    className={`w-1 rounded-full transition-colors ${
                      state === 'LISTENING'
                        ? 'bg-[#E07A5F]'
                        : state === 'SPEAKING'
                        ? 'bg-[#D7F04A]'
                        : state === 'THINKING'
                        ? 'bg-emerald-400'
                        : 'bg-white/20'
                    }`}
                  />
                );
              })}
            </div>

            {/* Multimodal Verified Visual Results */}
            {visualResults.length > 0 && (
              <div className="pt-2 text-left space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FAF8F5] font-bold flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#E07A5F]" />
                    Verified Culinary Recommendations
                  </span>
                  <span className="text-[10px] font-mono text-[#A7ACB8]">
                    Say "Add the first one" or tap below
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {visualResults.map((dish, dIdx) => (
                    <div
                      key={dish.id || dIdx}
                      className="p-3.5 rounded-2xl bg-[#161820] border border-[#272B36] hover:border-[#E07A5F]/60 transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative mb-2.5 overflow-hidden rounded-xl aspect-[16/10] bg-[#111216]">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold flex items-center gap-1 border border-white/15">
                            <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                            <span className={dish.isVeg ? 'text-emerald-400' : 'text-rose-400'}>
                              {dish.isVeg ? 'VEG' : 'NON-VEG'}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-[#141518]/90 backdrop-blur-md text-[#FAF8F5] text-[11px] font-mono font-bold border border-white/20">
                            ₹{dish.price}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#E07A5F] font-semibold uppercase tracking-wider block truncate">
                          {dish.restaurantName}
                        </span>
                        <h5 className="text-xs sm:text-[13px] font-bold text-[#FAF8F5] line-clamp-1 mb-1">
                          {dish.name}
                        </h5>

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
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(dish)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-[#E07A5F] hover:bg-[#CC6D54] text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
                        >
                          {addedIds[dish.id] ? (
                            <>
                              <Check size={12} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Add to Order
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            closeVoice();
                            navigate(`/restaurants/${dish.restaurantId}`);
                          }}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A7ACB8] hover:text-[#FAF8F5] transition-colors border border-white/5 cursor-pointer"
                          title="View Restaurant"
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Voice Prompt Starters */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              {suggestedFollowUps.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => submitTranscript(item)}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#C2C6D1] hover:text-[#FAF8F5] text-xs font-mono border border-white/10 transition-colors cursor-pointer"
                >
                  "{item}"
                </button>
              ))}
            </div>
          </div>

          {/* Master Voice Mic Surface */}
          <div className="p-4 sm:p-5 bg-[#14161E] border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8C91A0]">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/15 text-[10px]">
                ⌘M
              </kbd>
              <span className="hidden sm:inline">Toggle microphone</span>
            </div>

            {/* Center Mic Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (state === 'LISTENING') {
                  stopListening();
                } else if (state === 'SPEAKING') {
                  interrupt();
                } else {
                  startListening();
                }
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                state === 'LISTENING'
                  ? 'bg-[#E07A5F] text-white shadow-[#E07A5F]/40 ring-4 ring-[#E07A5F]/20'
                  : state === 'SPEAKING'
                  ? 'bg-[#D7F04A] text-black shadow-[#D7F04A]/30 ring-4 ring-[#D7F04A]/20'
                  : 'bg-[#222530] text-[#E2DED4] hover:bg-[#2A2E3B] border border-white/15'
              }`}
              aria-label={state === 'LISTENING' ? 'Stop Listening' : 'Start Listening'}
            >
              {state === 'LISTENING' ? (
                <Mic size={24} className="animate-pulse" />
              ) : state === 'SPEAKING' ? (
                <Volume2 size={24} />
              ) : (
                <MicOff size={22} className="opacity-70" />
              )}
            </motion.button>

            <div className="text-right">
              <span className="text-[11px] font-mono text-[#8C91A0] block">
                {state === 'LISTENING' ? 'Tap to Pause' : 'Tap to Speak'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
