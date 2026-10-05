import React from 'react';
import { BarChart3, TrendingUp, Award } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { BranchComparisonCard } from './BranchComponents';

export const BranchComparisonPage: React.FC = () => {
  const { performanceMetrics } = usePortalBranchesStore();

  const sortedByRevenue = [...performanceMetrics].sort((a, b) => b.dailyRevenue - a.dailyRevenue);

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              📊 Multi-Location Side-by-Side Benchmark Matrix
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Outlet Performance & Operational Comparison
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Compare daily revenue volume, average order values (AOV), kitchen fulfillment SLA speed, staff coverage, and customer satisfaction ratings.
          </p>
        </div>
      </div>

      {/* Side-by-Side Matrix Table */}
      <BranchComparisonCard metrics={sortedByRevenue} />
    </div>
  );
};

export default BranchComparisonPage;
