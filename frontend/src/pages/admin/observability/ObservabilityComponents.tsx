import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Clock, RefreshCw, Cpu, Server, GitBranch } from 'lucide-react';
import { RouteLatencyBenchmark, GroupedErrorItem, DeploymentRelease, ModuleHealthScore, RegionUptime } from '../../../store/admin/adminObservabilityStore';

// ─── ObservabilitySummaryCard ─────────────────────────────────────────────────
interface ObservabilitySummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  statusBadge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info';
  };
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const ObservabilitySummaryCard: React.FC<ObservabilitySummaryCardProps> = ({
  title,
  value,
  subtitle,
  statusBadge,
  icon,
  actionLabel,
  onAction,
}) => {
  const getBadgeStyle = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            {title}
          </span>
          {statusBadge && (
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(statusBadge.variant)}`}>
              {statusBadge.text}
            </span>
          )}
          {icon && <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-700">{icon}</div>}
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{value}</h3>
          {subtitle && <p className="mt-1 text-[11px] font-semibold text-neutral-400">{subtitle}</p>}
        </div>
      </div>

      {actionLabel && onAction && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
          <button onClick={onAction} className="text-[11px] font-bold text-neutral-800 hover:text-black cursor-pointer">
            {actionLabel} →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── PerformanceTrendCard ────────────────────────────────────────────────────
export const PerformanceTrendCard: React.FC<{ benchmark: RouteLatencyBenchmark }> = ({ benchmark }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black text-neutral-900 font-heading">{benchmark.routeName}</span>
        {benchmark.isRegression ? (
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Regression
          </span>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Optimal
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-150 text-center">
        <div>
          <span className="text-[9px] font-bold text-neutral-400 block uppercase">p50</span>
          <span className="text-xs font-black text-neutral-900">{benchmark.p50Ms}ms</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-neutral-400 block uppercase">p95</span>
          <span className="text-xs font-black text-neutral-900">{benchmark.p95Ms}ms</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-neutral-400 block uppercase">p99</span>
          <span className={`text-xs font-black ${benchmark.p99Ms > benchmark.slaThresholdMs ? 'text-amber-600' : 'text-emerald-600'}`}>
            {benchmark.p99Ms}ms
          </span>
        </div>
      </div>

      <div className="text-[9px] text-neutral-400 flex justify-between">
        <span>SLA Threshold: {benchmark.slaThresholdMs}ms</span>
        <span>Route: {benchmark.category}</span>
      </div>
    </div>
  );
};

// ─── ErrorTrendCard ──────────────────────────────────────────────────────────
export const ErrorTrendCard: React.FC<{ error: GroupedErrorItem; onAcknowledge: (id: string) => void }> = ({ error, onAcknowledge }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
          {error.category.replace('_', ' ')}
        </span>
        <span className="text-xs font-black text-red-600">{error.occurrences} events</span>
      </div>

      <div>
        <h4 className="text-xs font-black text-neutral-900">{error.title}</h4>
        <span className="text-[10px] font-mono text-neutral-400 block truncate">{error.sourceFile}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px]">
        <span className="text-neutral-400">{error.affectedUsers} users affected</span>
        {error.status !== 'resolved' ? (
          <button
            onClick={() => onAcknowledge(error.id)}
            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            Acknowledge
          </button>
        ) : (
          <span className="text-emerald-600 font-bold">Resolved</span>
        )}
      </div>
    </div>
  );
};

// ─── ModuleHealthCard ────────────────────────────────────────────────────────
export const ModuleHealthCard: React.FC<{ module: ModuleHealthScore }> = ({ module }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-black text-neutral-900 font-heading">{module.moduleName}</h4>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {module.uptimePct}% Uptime
        </span>
      </div>

      <div className="flex justify-between text-[11px] text-neutral-500 pt-1">
        <span>Avg Latency: <strong className="text-neutral-800">{module.avgLatencyMs}ms</strong></span>
        <span>Error Rate: <strong className="text-neutral-800">{module.errorRatePct}%</strong></span>
      </div>
    </div>
  );
};
