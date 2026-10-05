import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, AlertOctagon, Globe, Database, GitBranch, Sparkles, AlertTriangle } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';
import { ObservabilitySummaryCard, PerformanceTrendCard, ErrorTrendCard } from './ObservabilityComponents';

export const ObservabilityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { benchmarks, errors, regions, queues, releases, moduleHealth, insights, stabilityScore, acknowledgeError } = useAdminObservabilityStore();

  const activeErrors = errors.filter((e) => e.status !== 'resolved');

  return (
    <div className="space-y-6 text-left">
      {/* Primary Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ObservabilitySummaryCard
          title="Overall Platform Stability"
          value={`${stabilityScore} / 100`}
          subtitle="All 6 modules operational"
          statusBadge={{ text: 'Stable', variant: 'success' }}
          icon={<Activity size={16} className="text-emerald-600" />}
          actionLabel="View Modules"
          onAction={() => navigate('/admin/observability/modules')}
        />

        <ObservabilitySummaryCard
          title="Avg Route Load Latency (p50)"
          value="42ms"
          subtitle="Well within 150ms SLA"
          statusBadge={{ text: 'Optimal', variant: 'success' }}
          icon={<Zap size={16} className="text-blue-600" />}
          actionLabel="Latency Breakdown"
          onAction={() => navigate('/admin/observability/performance')}
        />

        <ObservabilitySummaryCard
          title="Active Error Clusters"
          value={activeErrors.length}
          subtitle="1 High Severity Timeout"
          statusBadge={{ text: activeErrors.length > 0 ? 'Tracking' : 'Clean', variant: activeErrors.length > 0 ? 'warning' : 'success' }}
          icon={<AlertOctagon size={16} className="text-red-600" />}
          actionLabel="Error Monitor"
          onAction={() => navigate('/admin/observability/errors')}
        />

        <ObservabilitySummaryCard
          title="Global Uptime Ratio"
          value="99.98%"
          subtitle="India, EU & US Nodes"
          statusBadge={{ text: '99.98%', variant: 'success' }}
          icon={<Globe size={16} className="text-purple-600" />}
          actionLabel="Uptime Status"
          onAction={() => navigate('/admin/observability/uptime')}
        />
      </div>

      {/* AI Observability & Performance Warnings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#e35205]" />
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            AI Performance Regression & Telemetry Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-start justify-between gap-3 text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className={ins.severity === 'critical' ? 'text-red-600' : 'text-amber-600'} />
                  <h4 className="text-xs font-black text-neutral-900">{ins.title}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{ins.description}</p>
              </div>

              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                {ins.impactText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Grid: Latency Benchmarks & Grouped Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Latency Benchmarks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Route Latency Benchmarks (p50 / p95 / p99)
            </h4>
            <button onClick={() => navigate('/admin/observability/performance')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Routes →
            </button>
          </div>

          <div className="space-y-3">
            {benchmarks.slice(0, 3).map((b) => (
              <PerformanceTrendCard key={b.id} benchmark={b} />
            ))}
          </div>
        </div>

        {/* Grouped Error Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Active Error Clusters
            </h4>
            <button onClick={() => navigate('/admin/observability/errors')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Errors →
            </button>
          </div>

          <div className="space-y-3">
            {errors.map((e) => (
              <ErrorTrendCard key={e.id} error={e} onAcknowledge={acknowledgeError} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservabilityDashboard;
