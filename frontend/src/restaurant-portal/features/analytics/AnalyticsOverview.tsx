import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Award,
} from 'lucide-react';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoSectionHeader,
  FeastoMetric,
  FeastoButton,
} from '@/components/design-system';

export const AnalyticsOverview: React.FC = () => {
  const sparklinePoints = '10,85 40,70 70,78 100,50 130,62 160,28 190,40 220,12 250,22 280,8';

  const signatureDishes = [
    { rank: '01', name: 'Dum Mutton Biryani', velocity: '142 orders', rev: '₹48,280', growth: '+24%' },
    { rank: '02', name: 'Wood-fired Neapolitan Margherita', velocity: '98 orders', rev: '₹37,240', growth: '+12%' },
    { rank: '03', name: 'Crisp Ghee Roast Dosa', velocity: '86 orders', rev: '₹15,480', growth: '+8%' },
    { rank: '04', name: 'Tonkotsu 18-hr Ramen', velocity: '64 orders', rev: '₹26,880', growth: '+19%' },
  ];

  return (
    <div className="w-full space-y-8 text-left select-none">
      {/* ── 01. SECTION HEADER ── */}
      <FeastoSectionHeader
        index="07"
        title="RESTAURANT PERFORMANCE"
        subtitle="Quiet, editorial telemetry: gross merchandise volume, hearth velocities, and dish turnover."
        rightElement={
          <div className="font-mono text-xs flex items-center gap-2">
            <span className="text-[#8A8D98]">CYCLE:</span>
            <span className="px-2 py-1 bg-white border border-[#141518]/20 font-bold text-[#141518]">
              THIS WEEK (OCT 01–07)
            </span>
          </div>
        }
      />

      {/* ── 02. MASSIVE TYPOGRAPHIC STATEMENTS ── */}
      <div className="p-6 sm:p-8 bg-white border border-[#141518] space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#141518]/15">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
              GROSS DISPATCH VOLUME
            </span>
            <div className="font-heading font-black text-4xl sm:text-6xl text-[#141518] tracking-tight leading-none mt-2">
              ₹1,84,500
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2.5 py-1 bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30 font-bold">
              ↑ +14.2% THIS WEEK
            </span>
            <span className="text-[#52555F]">1,480 tickets cleared</span>
          </div>
        </div>

        {/* Quiet SVG Volume Curve */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-[#8A8D98]">
            <span>HOURLY REVENUE TRAJECTORY</span>
            <span className="text-[#15803D] font-bold">PEAK: 20:30 (₹24,800/hr)</span>
          </div>

          <div className="w-full h-40 bg-[#FAF8F5] border border-[#E2DED4] p-4 relative">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <line x1="0" y1="25" x2="300" y2="25" stroke="#E2DED4" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#E2DED4" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#E2DED4" strokeWidth="1" strokeDasharray="3 3" />
              <path
                d={`M ${sparklinePoints}`}
                fill="none"
                stroke="#141518"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-[#8A8D98] px-1">
            <span>MON 10:00</span>
            <span>WED 14:00</span>
            <span>FRI 20:00</span>
            <span>SUN 23:00</span>
          </div>
        </div>
      </div>

      {/* ── 03. SUPPORTING OPERATIONAL METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeastoMetric
          index="01"
          label="AVERAGE TICKET"
          value="₹1,246"
          delta={{ value: '+4.1%', positive: true }}
          subtitle="Customer bag depth: 2.8 items"
        />

        <FeastoMetric
          index="02"
          label="LINE PREP SPEED"
          value="16.4 min"
          delta={{ value: '1.2m FASTER', positive: true }}
          subtitle="98.2% dispatches under 25m SLA"
        />

        <FeastoMetric
          index="03"
          label="GUEST RETENTION"
          value="64.8%"
          delta={{ value: '+6.2%', positive: true }}
          subtitle="Repeat orders within 14 days"
        />
      </div>

      {/* ── 04. SIGNATURE DISH VELOCITY ── */}
      <div className="p-6 bg-[#FAF8F5] border border-[#141518]/20 space-y-4">
        <div className="pb-3 border-b border-[#141518]/15 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
              CATALOG EFFICIENCY
            </span>
            <h3 className="font-heading font-black text-lg uppercase text-[#141518]">
              Top Dish Velocities
            </h3>
          </div>
          <span className="font-mono text-xs text-[#52555F]">Ranked by weekly GMV</span>
        </div>

        <div className="divide-y divide-[#141518]/10 font-mono text-xs">
          {signatureDishes.map((dish) => (
            <div key={dish.rank} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#1B3BFF] text-sm">{dish.rank}</span>
                <div>
                  <span className="font-heading font-bold text-sm text-[#141518] block">
                    {dish.name}
                  </span>
                  <span className="text-[11px] text-[#52555F]">{dish.velocity}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-sm text-[#141518] block">{dish.rev}</span>
                <span className="text-[10px] text-[#15803D] font-bold">{dish.growth} WoW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
