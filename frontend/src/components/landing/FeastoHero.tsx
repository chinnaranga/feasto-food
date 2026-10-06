import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Star, 
  ShoppingBag, 
  Check, 
  Loader2,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { aiFoodDiscoveryService, FoodDiscoveryResponse, RecommendedFoodCard } from '@/services/ai/aiFoodDiscoveryService';
import { useCartStore } from '@/store/cartStore';

export const FeastoHero: React.FC = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [prompt, setPrompt] = useState('');
  const [uiState, setUiState] = useState<'idle' | 'analyzing' | 'recommendations'>('idle');
  const [result, setResult] = useState<FoodDiscoveryResponse | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const samplePrompts = [
    'Something spicy and comforting under ₹500',
    'Best Hyderabadi biryani nearby',
    'Healthy high-protein dinner',
    'Late night comfort food for 2',
    'Wood-fired authentic pizza',
  ];

  const handleRunSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setUiState('analyzing');
    setPrompt(queryText);

    try {
      const res = await aiFoodDiscoveryService.parseCraving(queryText);
      setResult(res);
      setUiState('recommendations');
    } catch {
      setUiState('idle');
    }
  };

  const handleAddToCart = (card: RecommendedFoodCard) => {
    addItem({
      cartItemId: `${card.restaurantId}-${card.id}-${Date.now()}`,
      restaurantId: card.restaurantId,
      restaurantName: card.restaurantName,
      item: card.menuItem,
      quantity: 1,
      selectedAddons: [],
      spiceLevel: 'medium',
      specialInstructions: '',
      unitPrice: card.price,
      totalPrice: card.price,
    });

    setAddedItemIds((prev) => ({ ...prev, [card.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [card.id]: false }));
    }, 2500);
  };

  return (
    <section className="relative overflow-hidden bg-[#08090D] pt-14 pb-20 md:pt-24 md:pb-28 text-center select-none">
      {/* Deep Atmospheric Radial Lighting */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(109, 94, 245, 0.45) 0%, rgba(79, 209, 232, 0.2) 45%, transparent 75%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subtle Brand Intent Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-xs mb-8 text-xs font-semibold text-[#A7ACB8]"
        >
          <span className="w-2 h-2 rounded-full bg-[#4FD1E8] shadow-xs shadow-[#4FD1E8]/50 animate-pulse" />
          <span className="text-[#F4F5F7]">Autonomous Food Companion</span>
          <span className="text-white/20">•</span>
          <span className="text-[#A7ACB8] flex items-center gap-1">
            <MapPin size={12} className="text-[#6D5EF5]" /> Hyderabad
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F4F5F7] tracking-tight leading-[1.05] mb-5 font-heading">
            What are you craving?
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-normal text-[#A7ACB8] max-w-2xl mx-auto leading-relaxed">
            Tell Feasto. We’ll find it.
          </p>
        </motion.div>

        {/* Central Conversational Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunSearch(prompt);
            }}
            className="relative bg-[#101218]/90 border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black/80 backdrop-blur-xl focus-within:border-[#6D5EF5] focus-within:ring-4 focus-within:ring-[#6D5EF5]/20 transition-all flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="w-full flex-grow px-3 py-2 text-left">
              <label htmlFor="craving-input" className="sr-only">
                Tell Feasto what you want to eat
              </label>
              <input
                id="craving-input"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Something spicy, comforting & under ₹500..."
                className="w-full text-base sm:text-lg text-[#F4F5F7] placeholder:text-[#6F7480] bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={uiState === 'analyzing'}
              aria-label="Ask Feasto"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#6D5EF5] hover:bg-[#5C4DE3] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-[#6D5EF5]/30 focus:ring-2 focus:ring-[#6D5EF5] focus:ring-offset-2 focus:ring-offset-[#08090D]"
            >
              {uiState === 'analyzing' ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Decoding...</span>
                </>
              ) : (
                <>
                  <span>Find Food</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Sample Prompt Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-semibold text-[#6F7480] mr-1">Quick:</span>
          {samplePrompts.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleRunSearch(sample)}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#A7ACB8] hover:text-[#F4F5F7] rounded-xl border border-white/5 hover:border-white/15 transition-all shadow-2xs"
            >
              "{sample}"
            </button>
          ))}
        </motion.div>

        {/* ─── DYNAMIC CONVERSATION STATE AREA ─── */}
        <AnimatePresence mode="wait">
          {uiState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="py-12 flex flex-col items-center justify-center gap-3 text-[#A7ACB8]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#101218] border border-white/10 shadow-lg flex items-center justify-center text-[#4FD1E8]">
                <Loader2 size={24} className="animate-spin" />
              </div>
              <p className="text-sm font-bold text-[#F4F5F7]">Decoding your craving intent...</p>
              <p className="text-xs text-[#6F7480]">Scanning live kitchen prep schedules & spice balances</p>
            </motion.div>
          )}

          {uiState === 'recommendations' && result && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mt-6 text-left"
            >
              {/* Intent Recognition Banner */}
              <div className="bg-[#101218] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4FD1E8]">
                      Decoded Intent
                    </span>
                    <span className="text-xs text-[#6F7480]">•</span>
                    <span className="text-xs text-[#A7ACB8]">{result.confidenceMessage}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.intent.detectedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#F4F5F7] text-xs font-semibold"
                      >
                        <Check size={12} className="text-[#2DD4BF]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUiState('idle')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-[#A7ACB8] hover:text-white transition-colors shrink-0"
                >
                  <RefreshCw size={12} />
                  <span>Reset Search</span>
                </button>
              </div>

              {/* 3 Real Recommended Dish Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.recommendations.map((card) => {
                  const isAdded = addedItemIds[card.id];
                  return (
                    <div
                      key={card.id}
                      className="group bg-[#101218] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300 flex flex-col"
                    >
                      {/* Image Frame */}
                      <div className="relative h-52 w-full overflow-hidden bg-[#171923]">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#08090D]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white border border-white/10 flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span>{card.rating}</span>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#08090D]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#A7ACB8] border border-white/10 flex items-center gap-1">
                          <Clock size={12} />
                          <span>{card.deliveryTime} mins</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-[#A7ACB8] uppercase tracking-wider mb-1">
                            {card.restaurantName} • {card.distance}
                          </p>
                          <h2 className="text-lg font-bold text-[#F4F5F7] mb-1 group-hover:text-[#6D5EF5] transition-colors">
                            {card.name}
                          </h2>
                          <p className="text-xs text-[#A7ACB8] line-clamp-2 mb-3 leading-relaxed">
                            {card.description}
                          </p>

                          {/* Match Reasoning Chip */}
                          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#A7ACB8] mb-4">
                            <span className="font-bold text-[#F4F5F7]">Why this:</span> {card.matchReason}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#6F7480] block">Price</span>
                            <span className="text-xl font-black text-[#F4F5F7]">₹{card.price}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/restaurants/${card.restaurantId}`)}
                              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#A7ACB8] hover:text-white hover:bg-white/5 transition-colors"
                            >
                              Menu
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(card)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                isAdded
                                  ? 'bg-[#2DD4BF] text-stone-950'
                                  : 'bg-[#6D5EF5] hover:bg-[#5C4DE3] text-white shadow-[#6D5EF5]/30'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag size={14} />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
