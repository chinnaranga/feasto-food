import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Zap,
  BarChart2,
  Layers,
} from 'lucide-react';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoMetric,
  FeastoButton,
} from '@/components/design-system';

export const Analytics: React.FC = () => {
  const [activeRange, setActiveRange] = useState<'today' | '7d' | '30d'>('7d');

  const funnelSteps = [
    { label: 'Platform Food Sessions', count: '12,500', pct: 100, delta: '+8%' },
    { label: 'AI Craving Natural Queries', count: '9,800', pct: 78.4, delta: '+19%' },
    { label: 'Curated Kitchen Dossier Visits', count: '6,400', pct: 51.2, delta: '+12%' },
    { label: 'Dish Added to Bag', count: '3,200', pct: 25.6, delta: '+14%' },
    { label: 'Checkout Vector Initiated', count: '2,100', pct: 16.8, delta: '+11%' },
    { label: 'Settled Order Deliveries', count: '1,850', pct: 14.8, delta: '+14.2%' },
  ];

  const categorySignals = [
    { name: 'Heritage Dum & Biryani Deghs', share: '38%', growth: '+28.4%', trend: 'up' },
    { name: 'Wood-fired Authentic Neapolitan', share: '24%', growth: '+14.1%', trend: 'up' },
    { name: 'Artisan Sourdough & Patisserie', share: '18%', growth: '+8.2%', trend: 'up' },
    { name: '18-Hour Broth Ramen & Japanese', share: '12%', growth: '+19.6%', trend: 'up' },
    { name: 'Specialty Cold Brews & Matcha', share: '8%', growth: '-2.1%', trend: 'down' },
  ];

  const sectorPaces = [
    { sector: 'Bandra West (Sector 01)', gmv: '₹4,80,000', surge: '1.4x PEAK', speed: '24m avg' },
    { sector: 'BKC Central (Sector 02)', gmv: '₹3,92,000', surge: '1.2x NOON', speed: '28m avg' },
    { sector: 'Worli South (Sector 03)', gmv: '₹2,64,000', surge: 'NORMAL', speed: '31m avg' },
    { sector: 'Khar West (Sector 04)', gmv: '₹1,12,000', surge: 'NORMAL', speed: '22m avg' },
  ];

  return (
    <div className="w-full space-y-8 text-left select-none text-[#F3F0E8]">
      {/* ── SECTION HEADER ── */}
      <FeastoSectionHeader
        index="08"
        title="FEASTO SIGNALS & INTELLIGENCE"
        subtitle="Macro platform dynamics: what is changing, where demand surges, and why delivery velocities shift."
        dark
        rightElement={
          <div className="flex bg-[#14161B] border border-white/10 p-1 font-mono text-xs">
            {(['today', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1 uppercase font-bold transition-colors cursor-pointer ${
                  activeRange === range
                    ? 'bg-[#1B3BFF] text-white'
                    : 'text-[#8E929C] hover:text-white'
                }`}
              >
                {range === 'today' ? 'Today' : range === '7d' ? 'Past 7 Days' : 'Month'}
              </button>
            ))}
          </div>
        }
      />

      {/* ── CORE PLATFORM GROWTH METRIC STATEMENTS ── */}
      <div className="p-6 sm:p-8 bg-[#14161B] border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#D7F04A] block">
              ANNUALIZED RUN-RATE GMV
            </span>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-none mt-2">
              ₹12,48,000
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-1 bg-[#15803D]/20 text-[#D7F04A] border border-[#D7F04A]/30 font-bold">
              ↑ +22.4% MOM ACCELERATION
            </span>
            <span className="text-[#8E929C]">14.8% End-to-end checkout yield</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <FeastoMetric
            index="01"
            label="AVERAGE TICKET DEPTH"
            value="₹1,240"
            delta={{ value: '+4.2% TICKET', positive: true }}
            subtitle="2.9 items per bag"
            dark
            highlight
          />

          <FeastoMetric
            index="02"
            label="AI CONVERSATIONAL YIELD"
            value="78.4%"
            delta={{ value: 'SEARCH TO DISH', positive: true }}
            subtitle="Natural language cravings"
            dark
          />

          <FeastoMetric
            index="03"
            label="RECOMMENDATION ACCURACY"
            value="94.6%"
            delta={{ value: '0 REJECTS', positive: true }}
            subtitle="Multi-modal sommelier match"
            dark
          />

          <FeastoMetric
            index="04"
            label="COURIER PASS TIME"
            value="3.2m"
            delta={{ value: 'COUNTER TO VESSEL', positive: true }}
            subtitle="Zero kitchen hold delays"
            dark
          />
        </div>
      </div>

      {/* ── SPLIT SIGNALS: CONVERSION FUNNEL + CATEGORY DYNAMICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Conversion Funnel (7 Cols) */}
        <div className="lg:col-span-7 p-6 bg-[#14161B] border border-white/10 space-y-5">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                CONVERSION FLOW
              </span>
              <h3 className="font-heading font-black text-lg uppercase text-white">
                Platform Session Yield
              </h3>
            </div>
            <span className="font-mono text-xs text-[#D7F04A] font-bold">14.8% NET COMPLETE</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {funnelSteps.map((step) => (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white font-bold">{step.label}</span>
                  <div className="flex items-center gap-3 text-[#8E929C]">
                    <span>{step.count}</span>
                    <strong className="text-white">{step.pct}%</strong>
                  </div>
                </div>

                <div className="w-full bg-[#1D212A] h-3 border border-white/5 relative overflow-hidden">
                  <div
                    className="h-full bg-[#1B3BFF] transition-all duration-500"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sector & Category Demand Shifts (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Signals */}
          <div className="p-6 bg-[#14161B] border border-white/10 space-y-4">
            <div className="pb-3 border-b border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                DEMAND VECTORS
              </span>
              <h3 className="font-heading font-black text-base uppercase text-white">
                Category Growth Shifts
              </h3>
            </div>

            <div className="divide-y divide-white/5 font-mono text-xs">
              {categorySignals.map((cat) => (
                <div key={cat.name} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-[#8E929C] truncate flex-1">{cat.name}</span>
                  <span className="font-bold text-white shrink-0">{cat.share}</span>
                  <span
                    className={`font-bold shrink-0 ${
                      cat.trend === 'up' ? 'text-[#15803D]' : 'text-[#ff738c]'
                    }`}
                  >
                    {cat.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Surge Pressure */}
          <div className="p-6 bg-[#14161B] border border-white/10 space-y-4">
            <div className="pb-3 border-b border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                GEOGRAPHIC VELOCITIES
              </span>
              <h3 className="font-heading font-black text-base uppercase text-white">
                Sector Quadrants
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {sectorPaces.map((sec) => (
                <div
                  key={sec.sector}
                  className="p-3 bg-[#1D212A] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-white block">{sec.sector}</strong>
                    <span className="text-[10px] text-[#8E929C]">{sec.speed}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold block">{sec.gmv}</span>
                    <span className="text-[10px] text-[#D7F04A] font-bold">{sec.surge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
