import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, GitBranch, Terminal, Key, Clock, FileText } from 'lucide-react';
import { BuildCheck, EnvironmentVariable, VersionInfo, ReleaseNoteItem } from '../../../store/admin/adminReleaseStore';

// ─── ReleaseSummaryCard ───────────────────────────────────────────────────────
interface ReleaseSummaryCardProps {
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

export const ReleaseSummaryCard: React.FC<ReleaseSummaryCardProps> = ({
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

// ─── BuildCheckItemWidget ────────────────────────────────────────────────────
export const BuildCheckItemWidget: React.FC<{ check: BuildCheck }> = ({ check }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <h4 className="text-xs font-black text-neutral-900 font-heading">{check.name}</h4>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">{check.details}</p>
      </div>

      <span className="text-[9px] font-mono text-neutral-400 shrink-0 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
        {check.executionTimeMs}ms
      </span>
    </div>
  );
};

// ─── EnvironmentCard ─────────────────────────────────────────────────────────
export const EnvironmentCard: React.FC<{ env: EnvironmentVariable }> = ({ env }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-black text-neutral-900">{env.key}</span>
        <span
          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            env.isConfigured
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {env.isConfigured ? 'Configured' : 'Missing'}
        </span>
      </div>

      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 font-mono text-xs text-neutral-600 truncate">
        {env.maskedValue}
      </div>

      <div className="flex justify-between text-[9px] text-neutral-400">
        <span>Scope: {env.scope}</span>
        <span>{env.isSecret ? 'Protected Secret' : 'Public Variable'}</span>
      </div>
    </div>
  );
};

// ─── ReleaseNotesCard ────────────────────────────────────────────────────────
export const ReleaseNotesCard: React.FC<{ notes: ReleaseNoteItem }> = ({ notes }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-left space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
              {notes.version}
            </span>
            <h4 className="text-sm font-black text-neutral-900 font-heading">{notes.releaseTitle}</h4>
          </div>
          <span className="text-[10px] text-neutral-400">Released: {notes.releaseDate}</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-1.5 text-xs">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block font-heading">
          New Features & Capabilities
        </span>
        <ul className="list-disc list-inside space-y-1 text-neutral-700 font-semibold">
          {notes.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* Bug Fixes */}
      <div className="space-y-1.5 text-xs pt-2 border-t border-neutral-100">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block font-heading">
          Bug Fixes & Stability
        </span>
        <ul className="list-disc list-inside space-y-1 text-neutral-700 font-semibold">
          {notes.bugFixes.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
