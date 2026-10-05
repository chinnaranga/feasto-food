import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, Wifi, Package, Lock } from 'lucide-react';
import { useDeploymentStatus } from '../../hooks/release/useDeploymentStatus';
import { ChecklistItem } from '../../types/release';

const categoryIcon = {
  build: Package,
  environment: Wifi,
  pwa: Shield,
  security: Lock,
};

const statusStyles: Record<ChecklistItem['status'], { icon: React.ReactNode; color: string }> = {
  pass: { icon: <CheckCircle size={14} />, color: 'text-emerald-500' },
  fail: { icon: <XCircle size={14} />, color: 'text-red-500' },
  warn: { icon: <AlertTriangle size={14} />, color: 'text-amber-500' },
};

export const DeploymentChecklist: React.FC = () => {
  const { score, passedCount, totalCount, items } = useDeploymentStatus();

  const scoreColor =
    score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-main bg-secondary-bg">
        <div className="flex items-center gap-2.5">
          <Shield size={16} className="text-brand-orange" />
          <h3 className="text-sm font-bold text-text-primary">Deployment Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-black ${scoreColor}`}>{score}%</span>
          <span className="text-xs text-text-muted">{passedCount}/{totalCount} passed</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-1 bg-surface-bg">
        <div
          className={`h-full transition-all duration-700 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Items */}
      <ul className="divide-y divide-border-main/60">
        {items.map((item) => {
          const { icon, color } = statusStyles[item.status];
          const CatIcon = categoryIcon[item.category];
          return (
            <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
              <span className={`mt-0.5 shrink-0 ${color}`}>{icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary">{item.name}</p>
                <p className="text-[11px] text-text-muted leading-snug mt-0.5">{item.description}</p>
              </div>
              <CatIcon size={12} className="text-text-muted shrink-0 mt-0.5" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default DeploymentChecklist;
