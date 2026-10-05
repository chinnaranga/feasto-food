import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Heart, Wallet, Clock, Navigation, History, ChefHat } from 'lucide-react';

interface IntentDimension {
  id: string;
  name: string;
  icon: React.ReactNode;
  activeValue: string;
  options: string[];
}

interface IntentChipsProps {
  onSelectDimension?: (dimension: string, value: string) => void;
}

export const IntentChips: React.FC<IntentChipsProps> = ({ onSelectDimension }) => {
  const [dimensions, setDimensions] = useState<IntentDimension[]>([
    {
      id: 'craving',
      name: 'Craving',
      icon: <Utensils size={14} />,
      activeValue: 'Spicy & Comforting',
      options: ['Spicy & Comforting', 'Warm Broth', 'Crispy Dosa', 'Wood-Fired Crust', 'Fragrant Rice'],
    },
    {
      id: 'budget',
      name: 'Budget',
      icon: <Wallet size={14} />,
      activeValue: 'Under ₹500',
      options: ['Under ₹300', 'Under ₹500', 'Under ₹800', 'Special Feast'],
    },
    {
      id: 'diet',
      name: 'Dietary',
      icon: <Heart size={14} />,
      activeValue: 'Vegetarian Friendly',
      options: ['Vegetarian Friendly', 'Pure Veg (Jain Safe)', 'High Protein (>30g)', 'Low Carb'],
    },
    {
      id: 'distance',
      name: 'Radius',
      icon: <Navigation size={14} />,
      activeValue: '< 2.5 km',
      options: ['< 1.5 km (Fastest)', '< 2.5 km', '< 5 km', 'All Hyderabad'],
    },
    {
      id: 'time',
      name: 'Speed',
      icon: <Clock size={14} />,
      activeValue: 'Under 25 mins',
      options: ['Immediate (15-20 min)', 'Under 25 mins', 'Dinner Slot (8:00 PM)'],
    },
    {
      id: 'cuisine',
      name: 'Cuisine',
      icon: <ChefHat size={14} />,
      activeValue: 'Hyderabadi Dum',
      options: ['Hyderabadi Dum', 'South Indian Filter Cafe', 'Artisanal Italian', 'Tokyo Ramen'],
    },
    {
      id: 'history',
      name: 'Taste Memory',
      icon: <History size={14} />,
      activeValue: 'Learned: Loves Ghee & Saffron',
      options: ['Learned: Loves Ghee & Saffron', 'Prefers Medium Spice', 'Always orders extra raita'],
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSelectOption = (dimId: string, option: string) => {
    setDimensions((prev) =>
      prev.map((d) => (d.id === dimId ? { ...d, activeValue: option } : d))
    );
    setExpandedId(null);
    onSelectDimension?.(dimId, option);
  };

  return (
    <section className="border-y border-white/5 bg-[#08090D] py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4FD1E8] shadow-sm shadow-[#4FD1E8]/50 animate-ping" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#A7ACB8]">
              Feasto Understands
            </h2>
          </div>
          <p className="text-xs text-[#6F7480] max-w-md">
            Click any parameter to see how Feasto dynamically shifts ranking weights.
          </p>
        </div>

        {/* Scrollable / Responsive Intelligence Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {dimensions.map((dim) => {
            const isExpanded = expandedId === dim.id;
            return (
              <div key={dim.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : dim.id)}
                  aria-expanded={isExpanded}
                  className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isExpanded
                      ? 'bg-[#1F2232] text-[#F4F5F7] border-[#6D5EF5] shadow-lg shadow-[#6D5EF5]/20'
                      : 'bg-[#101218] text-[#A7ACB8] border-white/8 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className={`${isExpanded ? 'text-[#4FD1E8]' : 'text-[#6F7480]'}`}>
                    {dim.icon}
                  </span>
                  <span className="text-[#6F7480] uppercase tracking-wider text-[10px] font-bold">
                    {dim.name}:
                  </span>
                  <span className="font-bold text-[#F4F5F7]">{dim.activeValue}</span>
                </button>

                {/* Dropdown Options */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 mt-2 z-40 bg-[#171923] border border-white/12 rounded-2xl shadow-2xl p-2 min-w-[220px]"
                  >
                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6F7480]">
                      Adjust {dim.name}
                    </p>
                    <div className="space-y-1">
                      {dim.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(dim.id, opt)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            dim.activeValue === opt
                              ? 'bg-[#6D5EF5]/15 text-[#4FD1E8] font-bold'
                              : 'text-[#A7ACB8] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{opt}</span>
                          {dim.activeValue === opt && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1E8]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
