import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { AlertItem } from '../../store/portalDashboardStore';

interface AlertCardProps {
  alert: AlertItem;
  onDismiss?: (id: string) => void;
}

const TYPE_CONFIGS = {
  error: {
    bg: 'bg-red-50/60 border-red-200/80',
    icon: <AlertCircle size={14} className="text-red-600" />,
    text: 'text-red-900',
    subtext: 'text-red-700/80',
  },
  warning: {
    bg: 'bg-amber-50/60 border-amber-200/80',
    icon: <AlertTriangle size={14} className="text-amber-600" />,
    text: 'text-amber-900',
    subtext: 'text-amber-700/80',
  },
  info: {
    bg: 'bg-neutral-50 border-neutral-200',
    icon: <Info size={14} className="text-neutral-500" />,
    text: 'text-neutral-900',
    subtext: 'text-neutral-500',
  },
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onDismiss }) => {
  const config = TYPE_CONFIGS[alert.type] || TYPE_CONFIGS.info;

  const getSourceBadge = () => {
    const labels = {
      stock: 'Inventory',
      staff: 'Roster Schedule',
      SLA: 'Delivery SLA',
      general: 'System Alert',
    };
    return labels[alert.source] || labels.general;
  };

  const getElapsedTime = (isoStr: string) => {
    const elapsedMs = Date.now() - new Date(isoStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    return `${Math.floor(elapsedMins / 60)}h ago`;
  };

  return (
    <div
      className={`border rounded-xl p-4 flex items-start gap-3 relative transition-all duration-200 hover:shadow-xs text-left ${config.bg}`}
      role="alert"
    >
      {/* Icon */}
      <div className="shrink-0 mt-0.5">{config.icon}</div>

      {/* Message block */}
      <div className="flex-1 pr-6 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[11px] font-bold ${config.text}`}>{alert.title}</span>
          <span className="px-1.5 py-0.5 rounded bg-white/70 border border-neutral-200/40 text-[8px] font-black uppercase tracking-wider text-neutral-500 shadow-3xs">
            {getSourceBadge()}
          </span>
          <span className="text-[9px] text-neutral-400 font-medium">
            {getElapsedTime(alert.timestamp)}
          </span>
        </div>
        <p className={`text-[10px] leading-relaxed font-medium ${config.subtext}`}>
          {alert.description}
        </p>
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDismiss(alert.id)}
          className="absolute right-3 top-3 p-1 rounded-lg hover:bg-black/5 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
};

export default AlertCard;
