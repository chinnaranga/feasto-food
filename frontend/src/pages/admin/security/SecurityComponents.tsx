import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock, Eye, EyeOff, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SecurityIncident, IncidentSeverity, ComplianceCheckItem, PrivacyRequest, AccessEvent } from '../../../store/admin/adminSecurityStore';

// ─── SeverityBadge ────────────────────────────────────────────────────────────
export const SeverityBadge: React.FC<{ severity: IncidentSeverity }> = ({ severity }) => {
  const getStyle = () => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300 font-black animate-pulse';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStyle()}`}>
      {severity}
    </span>
  );
};

// ─── SecuritySummaryCard ──────────────────────────────────────────────────────
interface SecuritySummaryCardProps {
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

export const SecuritySummaryCard: React.FC<SecuritySummaryCardProps> = ({
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

// ─── ComplianceCard ──────────────────────────────────────────────────────────
export const ComplianceCard: React.FC<{ item: ComplianceCheckItem }> = ({ item }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
          {item.region}
        </span>
        <span
          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            item.status === 'compliant'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {item.status.replace('_', ' ')}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-black text-neutral-900 font-heading">{item.title}</h4>
        <p className="text-[10px] text-neutral-400 mt-0.5">
          Audited: {item.lastAudited} · Officer: {item.responsibleOfficer}
        </p>
      </div>
    </div>
  );
};

// ─── PrivacyRequestCard ──────────────────────────────────────────────────────
export const PrivacyRequestCard: React.FC<{ request: PrivacyRequest; onResolve: (id: string) => void }> = ({
  request,
  onResolve,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          {request.requestType.replace('_', ' ')}
        </span>

        <span className="text-[10px] font-black text-amber-600">
          {request.deadlineHours}h SLA Deadline
        </span>
      </div>

      <div>
        <h4 className="text-xs font-black text-neutral-900">{request.userName}</h4>
        <span className="text-[10px] text-neutral-400 block font-mono">{request.userEmail}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <span className="text-[9px] text-neutral-400">Requested: {request.requestedAt}</span>
        {request.status !== 'completed' ? (
          <button
            onClick={() => onResolve(request.id)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-3xs"
          >
            Fulfill Request
          </button>
        ) : (
          <span className="text-[10px] font-bold text-emerald-600">Completed</span>
        )}
      </div>
    </div>
  );
};
