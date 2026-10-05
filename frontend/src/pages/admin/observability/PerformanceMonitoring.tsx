import React from 'react';
import { Zap, Clock, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';
import { PerformanceTrendCard } from './ObservabilityComponents';

export const PerformanceMonitoring: React.FC = () => {
  const { benchmarks } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Real User Latency Profiling (RUM)
            </span>
            <span className="text-xs text-neutral-400 font-bold">p50 / p95 / p99 Benchmarks</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Route Load Timing & Performance Latency
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Measure end-to-end user timing across cart checkout, dish menu search, merchant KDS order streams, and analytics reporting.
          </p>
        </div>
      </div>

      {/* Latency Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benchmarks.map((b) => (
          <PerformanceTrendCard key={b.id} benchmark={b} />
        ))}
      </div>
    </div>
  );
};

export default PerformanceMonitoring;
