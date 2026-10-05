import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Wallet, 
  Heart, 
  CloudRain, 
  Store, 
  Bike,
  CheckCircle2
} from 'lucide-react';

interface IntelligenceNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
  inputExample: string;
  recommendationShift: string[];
}

const INTELLIGENCE_NODES: IntelligenceNode[] = [
  {
    id: 'taste',
    name: 'Taste & Spices',
    icon: <Sparkles size={18} />,
    subtitle: 'Flavor Vector Memory',
    inputExample: 'Loves whole cloves, saffron dum, and mild tartness; avoids raw onions',
    recommendationShift: [
      'Boosts Awadhi and Hyderabadi dum rice pots with verified saffron infusions',
      'Filters out heavy black pepper sauces without prompting',
      'Flags chef specials matching previous 5-star dish ratings',
    ],
  },
  {
    id: 'budget',
    name: 'Dynamic Budget',
    icon: <Wallet size={18} />,
    subtitle: 'Transparent Pricing Guard',
    inputExample: '₹350 limit per person including taxes and delivery',
    recommendationShift: [
      'Strictly prioritizes high-value single meal bowls under ₹350',
      'Excludes restaurants with high delivery fees outside immediate radius',
      'Auto-applies available kitchen discounts before you reach checkout',
    ],
  },
  {
    id: 'weather',
    name: 'Weather Context',
    icon: <CloudRain size={18} />,
    subtitle: 'Atmospheric Conditioning',
    inputExample: 'Heavy monsoon evening shower across Jubilee Hills',
    recommendationShift: [
      'Surfaces piping hot piping broths, chai flasks, and warm biryani',
      'Expands thermal insulated courier dispatch priority',
      'Adjusts transit delay predictions by 6 minutes for safety',
    ],
  },
  {
    id: 'time',
    name: 'Time Criticality',
    icon: <Clock size={18} />,
    subtitle: 'Kitchen Prep Synchrony',
    inputExample: 'Need food delivered within 22 minutes before a work meeting',
    recommendationShift: [
      'Filters only for kitchens with pre-batched bases (e.g. quick-fry bowls, sushi rolls)',
      'Assigns couriers currently within 500m of the pickup counter',
      'Hides slow-roasting or tandoor dishes requiring > 25 mins cook time',
    ],
  },
  {
    id: 'diet',
    name: 'Dietary Strictness',
    icon: <Heart size={18} />,
    subtitle: 'Allergen & Philosophy Guard',
    inputExample: 'Strict Pure Vegetarian (Jain prep without root vegetables)',
    recommendationShift: [
      'Restricts search exclusively to certified pure-veg kitchens',
      'Removes items prepared in shared fryers or woks',
      'Highlights allergen-audited ingredients directly in the menu snippet',
    ],
  },
  {
    id: 'location',
    name: 'Hyper-Local Proximity',
    icon: <MapPin size={18} />,
    subtitle: 'Neighborhood Micro-Zones',
    inputExample: 'Madhapur Cyber Towers sector',
    recommendationShift: [
      'Prioritizes artisan kitchens within immediate 1.8 km radius',
      'Ensures food travels less than 12 minutes in the courier pack',
      'Surfaces neighborhood chef specials exclusive to this postal code',
    ],
  },
];

export const FeastoIntelligence: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<IntelligenceNode>(INTELLIGENCE_NODES[0]);

  return (
    <section className="py-20 md:py-32 bg-[#08090D] border-t border-[#1F2232] text-[#F4F5F7] relative overflow-hidden select-none">
      {/* Subtle Atmospheric Gradient Glows */}
      <div 
        className="pointer-events-none absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(109, 94, 245, 0.3) 0%, rgba(79, 209, 232, 0.15) 50%, transparent 80%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171923] text-[#4FD1E8] text-xs font-bold mb-4 border border-[#25293A]">
            <Sparkles size={13} />
            <span>Multi-Dimensional Decision Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F4F5F7] tracking-tight leading-[1.08] mb-4">
            More than a menu.
          </h2>
          <p className="text-base sm:text-xl text-[#A7ACB8] font-normal leading-relaxed">
            Feasto connects the factors that actually matter when choosing food. Click any dimension below to see how our engine dynamically shifts dining weights in real time.
          </p>
        </div>

        {/* Intelligence Nodes Grid & Adaptive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Dynamic Node Buttons */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {INTELLIGENCE_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#141720] border-[#6D5EF5] shadow-lg shadow-[#6D5EF5]/15 text-[#F4F5F7] ring-1 ring-[#6D5EF5]'
                      : 'bg-[#101218] border-[#1F2232] text-[#A7ACB8] hover:bg-[#141720] hover:text-[#F4F5F7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#6D5EF5] text-white' : 'bg-[#171923] text-[#A7ACB8] border border-[#25293A]'
                      }`}
                    >
                      {node.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{node.name}</p>
                      <p className="text-[11px] text-[#6F7480]">{node.subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected ? 'bg-[#4FD1E8] scale-125' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Engine Weight Shift Demonstration Canvas */}
          <div className="lg:col-span-7 bg-[#101218] border border-[#1F2232] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            
            <div className="flex items-center justify-between pb-6 border-b border-[#1F2232] mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4FD1E8]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4F5F7]">
                  Adaptive Logic: {selectedNode.name}
                </span>
              </div>
              <span className="text-xs text-[#6F7480] font-mono">
                weight_bias: calibrated
              </span>
            </div>

            {/* Input Context Example */}
            <div className="bg-[#141720] border border-[#25293A] rounded-2xl p-5 mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A78BFA] block mb-1">
                Contextual Input
              </span>
              <p className="text-sm sm:text-base font-medium text-[#F4F5F7] italic">
                "{selectedNode.inputExample}"
              </p>
            </div>

            {/* Engine Shifts List */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F7480] block mb-4">
                How Feasto Adapts Menu Rankings
              </span>

              <div className="space-y-3">
                {selectedNode.recommendationShift.map((shift, idx) => (
                  <motion.div
                    key={`${selectedNode.id}-${idx}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.08 }}
                    className="p-4 rounded-xl bg-[#141720] border border-[#1F2232] flex items-start gap-3"
                  >
                    <CheckCircle2 size={16} className="text-[#2DD4BF] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-[#A7ACB8] leading-relaxed">
                      {shift}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1F2232] flex items-center justify-between text-xs text-[#6F7480]">
              <span>Zero hardcoded percentages.</span>
              <span className="text-[#A7ACB8] font-semibold">Continuous evaluation</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
