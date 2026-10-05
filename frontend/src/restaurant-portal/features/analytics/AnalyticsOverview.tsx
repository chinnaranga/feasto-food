import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, AlertTriangle, Sparkles, TrendingDown } from 'lucide-react';
import Card from '../../components/ui/Card';

export const AnalyticsOverview: React.FC = () => {
  // SVG Sparkline path coordinates
  const sparklinePoints = '10,90 40,75 70,82 100,55 130,68 160,30 190,45 220,15 250,28 280,10';

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Net Sales */}
        <Card className="p-4 space-y-2">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Net Sales Revenue</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-neutral-800">₹1,84,500</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">
              <ArrowUpRight size={10} /> +14.2%
            </span>
          </div>
          <p className="text-[9px] text-neutral-400">vs. last week (WoW)</p>
        </Card>

        {/* Orders */}
        <Card className="p-4 space-y-2">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Orders</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-neutral-800">1,480</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">
              <ArrowUpRight size={10} /> +8.5%
            </span>
          </div>
          <p className="text-[9px] text-neutral-400">Completion rate: 98.4%</p>
        </Card>

        {/* Avg Order Value */}
        <Card className="p-4 space-y-2">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg Order Value</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-neutral-800">₹1,246</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-red-650 bg-red-50/50 px-1 rounded">
              <ArrowDownRight size={10} className="text-red-500" /> -2.1%
            </span>
          </div>
          <p className="text-[9px] text-neutral-400">Refund rate: 0.4%</p>
        </Card>

        {/* Prep Speed */}
        <Card className="p-4 space-y-2">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Kitchen prep speed</h5>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-neutral-800">7.2 min</span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">
              <ArrowUpRight size={10} /> -1.5m
            </span>
          </div>
          <p className="text-[9px] text-neutral-400">Late order rate: 1.2%</p>
        </Card>

      </div>

      {/* Sales Trend line visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sparkline chart card */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Revenue Trendline</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">Continuous sales volumes mapped over the active date range.</p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <TrendingUp size={14} />
              <span>Stable Growth</span>
            </div>
          </div>

          {/* SVG Line visualization */}
          <div className="w-full h-44 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center p-3 relative">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f1f1" strokeWidth="1" />
              
              {/* Path */}
              <path
                d={`M ${sparklinePoints}`}
                fill="none"
                stroke="#e35205"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Gradient background */}
              <path
                d={`M 10,100 L ${sparklinePoints} L 280,100 Z`}
                fill="url(#sparkline-grad)"
                opacity="0.08"
              />
              
              {/* Definitions */}
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e35205" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>

        {/* AI Recommendations sidebar */}
        <div className="space-y-6">
          <Card className="text-left space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#e35205]" />
              <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
                AI Executive Analysis
              </h5>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <p className="text-[10px] text-neutral-500 leading-normal">
                  <strong>Gross Margin Forecast:</strong> Net profit ratio is expected to peak at <strong>68%</strong> this month.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <p className="text-[10px] text-neutral-500 leading-normal">
                  <strong>Anomaly Detection:</strong> Matcha Latte sales dropped by 18% during afternoon hours compared to last week.
                </p>
              </div>
            </div>
          </Card>

          {/* SLA Alerts card */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
            <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Peak Load Prediction</p>
              <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
                Saturday evenings (19:00 - 21:00) represent your peak operational bottleneck. Ensure kitchen chef shift schedules have 100% attendance coverage.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsOverview;
