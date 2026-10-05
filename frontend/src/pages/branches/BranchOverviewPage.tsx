import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, AlertTriangle, Sparkles, TrendingUp, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import {
  BranchSummaryCard,
  BranchCard,
  BranchComparisonCard,
} from './BranchComponents';

export const BranchOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    branches,
    performanceMetrics,
    readinessScores,
    aiInsights,
    setSelectedBranchId,
    toggleBranchStatus,
  } = usePortalBranchesStore();

  const totalCount = branches.length;
  const activeCount = branches.filter((b) => b.status === 'active').length;
  const reviewCount = branches.filter((b) => b.status === 'review_needed').length;
  const launchingCount = branches.filter((b) => b.status === 'launching').length;

  const handleSelectBranch = (id: string) => {
    setSelectedBranchId(id);
    navigate(`/restaurant/branches/${id}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 4 Key Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BranchSummaryCard
          title="Total Outlets"
          value={`${totalCount} Locations`}
          subtitle={`${activeCount} Operational Now`}
          icon={<Store size={18} />}
          statusTag="● Network Operational"
          statusVariant="success"
        />
        <BranchSummaryCard
          title="Active Outlets"
          value={`${activeCount} Open`}
          subtitle="Avg Prep SLA 19m"
          icon={<CheckCircle2 size={18} />}
          statusTag="98% Uptime"
          statusVariant="success"
        />
        <BranchSummaryCard
          title="Needs Review"
          value={`${reviewCount} Outlets`}
          subtitle="Staffing / Hours Gaps"
          icon={<AlertTriangle size={18} />}
          statusTag={reviewCount > 0 ? "⚠️ Action Required" : "● All Optimal"}
          statusVariant={reviewCount > 0 ? "warning" : "success"}
        />
        <BranchSummaryCard
          title="Upcoming Outlets"
          value={`${launchingCount} In Pipeline`}
          subtitle="Launch Readiness 75%"
          icon={<TrendingUp size={18} />}
          statusTag="🚀 Expanding"
          statusVariant="neutral"
        />
      </div>

      {/* AI Branch Optimization Banner */}
      {aiInsights.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#e35205] animate-pulse" />
              <h4 className="text-xs font-black uppercase text-neutral-900 tracking-wider font-heading">
                AI Recommendation: {aiInsights[0].title}
              </h4>
            </div>
            <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
              {aiInsights[0].description} <strong className="text-neutral-900">{aiInsights[0].recommendation}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/restaurant/branches/assignments')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Review Staffing
          </button>
        </div>
      )}

      {/* Active Location Directory Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
            Active Multi-Branch Outlets
          </h3>
          <button
            onClick={() => navigate('/restaurant/branches/directory')}
            className="text-xs font-bold text-[#e35205] hover:underline cursor-pointer"
          >
            Full Directory ({branches.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.slice(0, 3).map((b) => (
            <BranchCard
              key={b.id}
              branch={b}
              readinessPct={readinessScores[b.id]?.overallReadinessPct}
              onSelect={handleSelectBranch}
              onToggleStatus={toggleBranchStatus}
            />
          ))}
        </div>
      </div>

      {/* Top Location Performance Benchmark Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
            Outlet Performance Benchmarks
          </h3>
          <button
            onClick={() => navigate('/restaurant/branches/compare')}
            className="text-xs font-bold text-[#e35205] hover:underline cursor-pointer"
          >
            Detailed Comparison →
          </button>
        </div>

        <BranchComparisonCard metrics={performanceMetrics} />
      </div>
    </div>
  );
};

export default BranchOverviewPage;
