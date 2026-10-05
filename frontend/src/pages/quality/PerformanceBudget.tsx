import React from 'react';
import { Zap, Activity } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';
import { PerformanceBudgetCard } from './QualityComponents';
import type { PerformanceBudgetItem } from '../../types/quality';

export const PerformanceBudget: React.FC = () => {
  const { performanceBudgets } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#e35205]/10 text-[#e35205] border border-[#e35205]/20">
              ● Performance Latency SLA & Bundle Budget
            </span>
            <span className="text-xs text-neutral-400 font-bold">100% Within Budget</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Route Latency SLA & Bundle Size Budgets
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor real-user latency budgets, gzip bundle chunk sizes (284kB vs 500kB limit), interaction latency (INP &lt; 50ms), and code-splitting efficiency.
          </p>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceBudgets.map((budget: PerformanceBudgetItem) => (
          <PerformanceBudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
};

export default PerformanceBudget;
