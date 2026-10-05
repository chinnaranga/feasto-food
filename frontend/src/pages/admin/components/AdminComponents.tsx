import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle, ShieldAlert, CheckCircle2, AlertTriangle, Activity, ToggleLeft, ToggleRight } from 'lucide-react';
import { FeatureFlag, AdminPermission, ServiceHealth, TrustSafetyReport } from '../../../store/admin/adminStore';

// ─── AdminSummaryCard ────────────────────────────────────────────────────────
interface AdminSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  badge?: {
    text: string;
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  };
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const AdminSummaryCard: React.FC<AdminSummaryCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  badge,
  icon,
  action,
  className = '',
}) => {
  const getBadgeStyle = (variant: string = 'neutral') => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 text-left flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
            {title}
          </span>
          {badge && (
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(badge.variant)}`}>
              {badge.text}
            </span>
          )}
          {icon && <div className="p-2 rounded-xl bg-neutral-50 text-neutral-600 border border-neutral-100">{icon}</div>}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{value}</h3>
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                trend.isPositive ? 'text-emerald-600' : trend.isNegative ? 'text-red-600' : 'text-neutral-500'
              }`}
            >
              {trend.isPositive && <ArrowUpRight size={14} />}
              {trend.isNegative && <ArrowDownRight size={14} />}
              {!trend.isPositive && !trend.isNegative && <Minus size={12} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {subtitle && <p className="mt-1 text-[11px] font-semibold text-neutral-400">{subtitle}</p>}
      </div>

      {action && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
          <button
            onClick={action.onClick}
            className="text-[11px] font-bold text-neutral-800 hover:text-black cursor-pointer"
          >
            {action.label} →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── SystemHealthCard ────────────────────────────────────────────────────────
interface SystemHealthCardProps {
  health: ServiceHealth;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ health }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between text-left">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              health.status === 'operational'
                ? 'bg-emerald-500 animate-pulse'
                : health.status === 'degraded'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
          />
          <h4 className="text-xs font-black text-neutral-800 font-heading">{health.serviceName}</h4>
        </div>
        <p className="text-[10px] text-neutral-400">
          Uptime: <strong className="text-neutral-700">{health.uptimePercentage}%</strong> · Latency: <strong className="text-neutral-700">{health.latencyMs}ms</strong>
        </p>
      </div>

      <span
        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
          health.status === 'operational'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : health.status === 'degraded'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}
      >
        {health.status}
      </span>
    </div>
  );
};

// ─── FeatureFlagCard ─────────────────────────────────────────────────────────
interface FeatureFlagCardProps {
  flag: FeatureFlag;
  onToggle: (key: string) => void;
  onRolloutChange: (key: string, pct: number) => void;
}

export const FeatureFlagCard: React.FC<FeatureFlagCardProps> = ({ flag, onToggle, onRolloutChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-neutral-900 font-heading">{flag.name}</h4>
            <span className="text-[9px] font-mono font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
              {flag.key}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{flag.description}</p>
        </div>

        <button
          onClick={() => onToggle(flag.key)}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            flag.isEnabled ? 'bg-emerald-600 text-white shadow-3xs' : 'bg-neutral-200 text-neutral-500'
          }`}
          title={flag.isEnabled ? 'Disable Flag' : 'Enable Flag'}
        >
          {flag.isEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
        </button>
      </div>

      {/* Target & Rollout Slider */}
      <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          <span>Target Audience: <strong className="text-neutral-700">{flag.targetAudience}</strong></span>
          <span>Rollout: <strong className="text-neutral-800">{flag.rolloutPercentage}%</strong></span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="10"
          disabled={!flag.isEnabled}
          value={flag.rolloutPercentage}
          onChange={(e) => onRolloutChange(flag.key, Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#e35205] disabled:opacity-40"
        />
      </div>

      <div className="text-[9px] text-neutral-400 flex justify-between pt-1">
        <span>Last modified by {flag.lastModifiedBy}</span>
        <span>{flag.lastModifiedAt}</span>
      </div>
    </div>
  );
};

// ─── StatusBadge & PriorityBadge ─────────────────────────────────────────────
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'verified':
      case 'active':
      case 'operational':
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'in_progress':
      case 'degraded':
      case 'investigating':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'suspended':
      case 'flagged':
      case 'critical':
      case 'high':
      case 'outage':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStyle()}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
