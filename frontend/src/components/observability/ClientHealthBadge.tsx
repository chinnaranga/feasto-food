import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useObservabilityStore } from '../../store/observability/observabilityStore';

export const ClientHealthBadge: React.FC = () => {
  const status = useObservabilityStore((state) => state.status);
  const score = useObservabilityStore((state) => state.healthScore);

  const configs = {
    optimal: {
      colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
      icon: <ShieldCheck size={13} className="shrink-0" />,
      label: 'Optimal',
    },
    degraded: {
      colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
      icon: <AlertTriangle size={13} className="shrink-0" />,
      label: 'Degraded',
    },
    critical: {
      colorClass: 'bg-red-500/10 border-red-500/20 text-red-500',
      icon: <ShieldAlert size={13} className="shrink-0" />,
      label: 'Critical',
    },
  };

  const current = configs[status] || configs.optimal;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${current.colorClass}`}>
      {current.icon}
      <span>System Health: {current.label} ({score}%)</span>
    </div>
  );
};
export default ClientHealthBadge;
