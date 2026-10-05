import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  ArrowRight, 
  Check, 
  Clock, 
  Star, 
  MapPin, 
  Sparkles,
  Users,
  Utensils
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '@/data/restaurants';

interface Scenario {
  id: string;
  title: string;
  userQuery: string;
  detectedContext: string[];
  reasons: string[];
  recommendedRestaurantIds: string[];
}

const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'dinner-for-two',
    title: 'Dinner for Two',
    userQuery: 'I need dinner for two tonight. One vegetarian, one eats chicken. Something comforting, not overly spicy, under ₹700.',
    detectedContext: ['Dinner for 2', '1 Vegetarian + 1 Non-Veg', 'Comfort Food', 'Mild to Medium Spice', 'Under ₹700 Total'],
    reasons: [
      'Dual-kitchen menu accommodates strict vegetarian and poultry dishes separately',
      'Both entrees fall within your ₹700 combined evening budget',
      'Average 26 min delivery window to ensure dishes arrive hot simultaneously',
      'High ratings for portion sizes suited for sharing',
    ],
    recommendedRestaurantIds: ['spice-route', 'artisan-table', 'la-cucina'],
  },
  {
    id: 'healthy-desk-lunch',
    title: 'Post-Workout Fuel',
    userQuery: 'Need a fast high-protein meal at my desk in Hitech City. Clean carbs, minimal oil, delivered within 25 minutes.',
    detectedContext: ['High Protein (>35g)', 'Clean Macros', 'Desk Lunch', 'Express < 25 mins'],
    reasons: [
      'Macro-verified nutritional breakdown available per dish',
      'Prepared in cold-pressed oils or grilled with olive oil dressing',
      'Direct dispatch from kitchens within 1.5 km of tech hubs',
      'Biodegradable tamper-proof bowl packaging',
    ],
    recommendedRestaurantIds: ['artisan-table', 'verde-kitchen', 'sora-sushi'],
  },
  {
    id: 'late-night-comfort',
    title: 'Midnight Cravings',
    userQuery: 'Working late in Madhapur. Need hot steaming biryani or comfort rice bowl. Open right now past midnight.',
    detectedContext: ['Late Night Delivery', 'Steaming Hot', 'Aromatic Rice / Biryani', 'Active Kitchen'],
    reasons: [
      'Kitchen verified cooking late-night batches fresh',
      'Thermal insulated insulated delivery bag preserves dum temperature',
      'Courier pickup ready in under 12 minutes',
    ],
    recommendedRestaurantIds: ['spice-route', 'la-cucina'],
  },
];

export const ConversationalDiscovery: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);
  const [customInput, setCustomInput] = useState('');
  const [activeQuery, setActiveQuery] = useState(PRESET_SCENARIOS[0].userQuery);
  const [isProcessing, setIsProcessing] = useState(false);

  const matchedRestaurants = selectedScenario.recommendedRestaurantIds
    .map((id) => MOCK_RESTAURANTS.find((r) => r.id === id))
    .filter(Boolean);

  const handleSelectScenario = (sc: Scenario) => {
    setIsProcessing(true);
    setSelectedScenario(sc);
    setActiveQuery(sc.userQuery);
    setTimeout(() => {
      setIsProcessing(false);
    }, 280);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsProcessing(true);
    setActiveQuery(customInput);
    // Find closest scenario or adapt
    const isVeg = customInput.toLowerCase().includes('veg');
    const isLate = customInput.toLowerCase().includes('night') || customInput.toLowerCase().includes('late');
    const matched = isLate ? PRESET_SCENARIOS[2] : isVeg ? PRESET_SCENARIOS[1] : PRESET_SCENARIOS[0];
    
    setTimeout(() => {
      setSelectedScenario({
        ...matched,
        userQuery: customInput,
      });
      setIsProcessing(false);
      setCustomInput('');
    }, 320);
  };

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] select-none text-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1E8] mb-2 block">
            Natural Language Dining
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-4">
            Don't search. Describe.
          </h2>
          <p className="text-base sm:text-xl text-[#A7ACB8] font-normal leading-relaxed">
            Food search shouldn’t feel like database querying. Tell Feasto your scenario in everyday words, and let our intelligence assemble the exact right dining plan.
          </p>
        </div>

        {/* Preset Context Selector Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold text-[#6F7480] mr-2">Example Scenarios:</span>
          {PRESET_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedScenario.id === sc.id
                  ? 'bg-[#6D5EF5] text-white shadow-md shadow-[#6D5EF5]/20'
                  : 'bg-[#101218] text-[#A7ACB8] border border-[#1F2232] hover:bg-[#171923] hover:text-[#F4F5F7]'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Large Conversational UI Canvas */}
        <div className="bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6D5EF5]/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* User Bubble */}
          <div className="flex items-start gap-4 mb-8 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#171923] border border-[#25293A] text-[#F4F5F7] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              You
            </div>
            <div className="bg-[#171923] border border-[#25293A] rounded-2xl rounded-tl-xs p-5 shadow-xs max-w-2xl">
              <p className="text-sm sm:text-base font-medium text-[#F4F5F7] leading-relaxed">
                "{activeQuery}"
              </p>
            </div>
          </div>

          {/* Feasto Response Bubble */}
          <div className="flex items-start gap-4 mb-8 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6D5EF5] to-[#4FD1E8] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-[#6D5EF5]/25">
              F
            </div>
            <div className="w-full max-w-4xl">
              <div className="bg-[#141720] border border-[#25293A] rounded-2xl rounded-tl-xs p-6 shadow-xs mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#4FD1E8]">
                    Got it
                  </span>
                  <span className="text-xs text-[#6F7480]">•</span>
                  <span className="text-xs font-semibold text-[#A7ACB8]">
                    Extracted requirements for Hyderabad kitchens
                  </span>
                </div>

                {/* Structured Context Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedScenario.detectedContext.map((ctx, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191C27] border border-[#25293A] text-[#F4F5F7] text-xs font-bold"
                    >
                      <Check size={13} className="text-[#2DD4BF]" />
                      {ctx}
                    </span>
                  ))}
                </div>

                {/* Subtle AI Reasoning: "Why these?" */}
                <div className="border-t border-[#1F2232] pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#A78BFA]" />
                    <span>Why these kitchens?</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#A7ACB8]">
                    {selectedScenario.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-baseline gap-2">
                        <span className="text-[#4FD1E8] font-bold">→</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Matching Recommended Places */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6F7480] mb-4">
                  Selected Dining Partners for this Meal
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {matchedRestaurants.map((restaurant) => {
                    if (!restaurant) return null;
                    return (
                      <Link
                        key={restaurant.id}
                        to={`/restaurants/${restaurant.id}`}
                        className="group bg-[#101218] rounded-2xl border border-[#1F2232] p-4 hover:border-[#6D5EF5]/60 hover:shadow-lg hover:shadow-[#6D5EF5]/5 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#6F7480] uppercase tracking-wider">
                              {restaurant.cuisine[0]}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#F4F5F7] bg-[#171923] border border-[#25293A] px-2 py-0.5 rounded-md">
                              <Star size={11} className="text-amber-400 fill-amber-400" />
                              {restaurant.rating}
                            </span>
                          </div>

                          <h3 className="font-black text-base text-[#F4F5F7] group-hover:text-[#4FD1E8] transition-colors mb-1">
                            {restaurant.name}
                          </h3>
                          <p className="text-xs text-[#A7ACB8] line-clamp-1 mb-3">
                            {restaurant.tagline}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#1F2232] flex items-center justify-between text-xs font-semibold text-[#A7ACB8]">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[#6F7480]" />
                            {restaurant.deliveryTime} mins
                          </span>
                          <span className="text-[#6D5EF5] group-hover:text-[#4FD1E8] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            View Menu <ArrowRight size={12} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Input Form for Custom Queries */}
          <form onSubmit={handleCustomSubmit} className="mt-8 pt-6 border-t border-[#1F2232] relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or describe your own meal e.g. 'Family dinner for 4 with mild South Indian thalis'..."
                className="w-full px-4 py-3 bg-[#0B0D14] border border-[#25293A] rounded-2xl text-xs sm:text-sm text-[#F4F5F7] placeholder-[#6F7480] focus:outline-none focus:border-[#6D5EF5] focus:ring-1 focus:ring-[#6D5EF5]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#6D5EF5] hover:bg-[#5B4BE8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md shadow-[#6D5EF5]/20"
              >
                <span>Ask Feasto</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};
