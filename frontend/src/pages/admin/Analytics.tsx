import React, { useState } from 'react';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { MetricCard } from '../../components/admin/MetricCard';
import { Cpu, Flame, Search, ArrowUpRight } from 'lucide-react';
import { DiagnosticSummaryCard } from '../../components/observability/DiagnosticSummaryCard';
import { PerformanceMetricsCard } from '../../components/observability/PerformanceMetricsCard';
import { ReleaseHealthCard } from '../../components/observability/ReleaseHealthCard';
import { RecoverySuggestionCard } from '../../components/observability/RecoverySuggestionCard';

export const Analytics: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'all' | 'premium' | 'student'>('all');

  // Conversion funnel steps data
  const funnelSteps = [
    { label: 'Platform Sessions', count: 12500, percent: 100 },
    { label: 'AI Craving Searches', count: 9800, percent: 78.4 },
    { label: 'Restaurant Views', count: 6400, percent: 51.2 },
    { label: 'Item Added to Cart', count: 3200, percent: 25.6 },
    { label: 'Checkout Reached', count: 2100, percent: 16.8 },
    { label: 'Delivered Order Payments', count: 1850, percent: 14.8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight font-heading">
            Platform Analytics Grid
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Track user conversion funnels, study AI recommendations efficiency, and monitor growth metrics.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex bg-surface-bg border border-border-main p-1 rounded-xl self-start">
          {(['all', 'premium', 'student'] as const).map((segment) => (
            <button
              key={segment}
              onClick={() => setActiveSegment(segment)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-main cursor-pointer capitalize
                ${
                  activeSegment === segment
                    ? 'bg-white border border-border-main shadow-xs text-brand-orange'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              {segment} Users
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Secondary KPI Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Order Value"
          value="₹1,240"
          change={4.2}
          changeDescription="vs last week"
        />
        <MetricCard
          title="User Conversion Ratio"
          value="14.8%"
          change={2.1}
          changeDescription="growth spike"
        />
        <MetricCard
          title="Recommendation Precision"
          value="94.6%"
          change={0.8}
          changeDescription="model accuracy"
        />
        <MetricCard
          title="Customer Lifetime Value"
          value="₹8,940"
          change={12.5}
          changeDescription="vs last quarter"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Checkout Conversion Funnel */}
        <div className="lg:col-span-7">
          <DashboardCard
            title="Conversion Funnel Analysis"
            description="Tracking session drops from initial homepage visit to completed order delivery."
          >
            <div className="space-y-4">
              {funnelSteps.map((step, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-xs">
                  <div className="w-40 text-left font-bold text-text-secondary truncate">
                    {step.label}
                  </div>
                  <div className="flex-1 bg-border-main/50 rounded-lg h-8 relative flex items-center pl-3">
                    <div
                      className="bg-brand-orange/15 border-r border-brand-orange h-8 rounded-lg absolute left-0 top-0 transition-all duration-500"
                      style={{ width: `${step.percent}%` }}
                    />
                    <span className="relative font-bold text-brand-orange z-10">
                      {step.percent}%
                    </span>
                  </div>
                  <div className="w-20 text-right font-mono font-bold text-text-primary">
                    {step.count.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right 5 Columns: AI Recommendation efficiency indicators */}
        <div className="lg:col-span-5 space-y-6">
          <DashboardCard
            title="AI Personalization Telemetry"
            description="Evaluation dashboard for personal ranking models, search query mappings, and conversions."
          >
            <div className="space-y-4 text-xs text-left">
              {/* Stat 1 */}
              <div className="flex items-center justify-between p-3 border border-border-main rounded-xl bg-surface-bg/30">
                <div className="flex gap-2.5 items-center">
                  <Cpu size={16} className="text-brand-orange" />
                  <div>
                    <p className="font-extrabold text-text-primary">Personalized Menus Uplift</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Order volumes triggered by AI listings.</p>
                  </div>
                </div>
                <span className="font-extrabold text-text-primary">+18.4%</span>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between p-3 border border-border-main rounded-xl bg-surface-bg/30">
                <div className="flex gap-2.5 items-center">
                  <Search size={16} className="text-brand-orange" />
                  <div>
                    <p className="font-extrabold text-text-primary">NLP Craving Matches</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Exact queries resolved by vector mappings.</p>
                  </div>
                </div>
                <span className="font-extrabold text-text-primary">91.2%</span>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between p-3 border border-border-main rounded-xl bg-surface-bg/30">
                <div className="flex gap-2.5 items-center">
                  <Flame size={16} className="text-brand-orange" />
                  <div>
                    <p className="font-extrabold text-text-primary">Customer Loyalty conversions</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Redemption rates of AI custom coupons.</p>
                  </div>
                </div>
                <span className="font-extrabold text-text-primary">76.8%</span>
              </div>

              {/* Action Link to model adjustments */}
              <div className="p-4 bg-brand-orange/5 border border-brand-orange/15 rounded-2xl flex items-center justify-between gap-4 mt-2">
                <div className="text-left">
                  <p className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">AI Forecast Metrics</p>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-relaxed">
                    AI recommendation node model runs at **94.6%** accuracy. Next scheduled model re-training: **Tomorrow at 3:00 AM**.
                  </p>
                </div>
                <div className="text-brand-orange shrink-0">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

      </div>

      {/* Platform Observability & Live Telemetry Dashboards */}
      <div className="border-t border-border-main/60 pt-6">
        <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider text-left mb-4">
          Platform Observability & Live Telemetry
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DiagnosticSummaryCard />
          <PerformanceMetricsCard />
          <ReleaseHealthCard />
          <RecoverySuggestionCard />
        </div>
      </div>
    </div>
  );
};

