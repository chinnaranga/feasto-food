import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';

interface FinanceCardProps {
  title: string;
  amount: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNegative?: boolean;
    label?: string;
  };
  badge?: {
    text: string;
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
  };
  icon?: React.ReactNode;
  tooltip?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({
  title,
  amount,
  subtitle,
  trend,
  badge,
  icon,
  tooltip,
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
      case 'brand':
        return 'bg-orange-50 text-[#e35205] border-orange-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 text-left relative flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider truncate font-heading">
              {title}
            </span>
            {tooltip && (
              <span className="text-neutral-300 hover:text-neutral-500 cursor-help transition-colors" title={tooltip}>
                <HelpCircle size={12} />
              </span>
            )}
          </div>
          {badge && (
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(
                badge.variant
              )}`}
            >
              {badge.text}
            </span>
          )}
          {icon && <div className="p-2 rounded-xl bg-neutral-50 text-neutral-600 border border-neutral-100">{icon}</div>}
        </div>

        {/* Amount */}
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{amount}</h3>
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                trend.isPositive
                  ? 'text-emerald-600'
                  : trend.isNegative
                  ? 'text-red-600'
                  : 'text-neutral-500'
              }`}
            >
              {trend.isPositive && <ArrowUpRight size={14} />}
              {trend.isNegative && <ArrowDownRight size={14} />}
              {!trend.isPositive && !trend.isNegative && <Minus size={12} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Subtitle or trend label */}
        {(subtitle || trend?.label) && (
          <p className="mt-1 text-[11px] font-semibold text-neutral-400">
            {subtitle || trend?.label}
          </p>
        )}
      </div>

      {/* Optional action footer */}
      {action && (
        <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
          <button
            onClick={action.onClick}
            className="text-[11px] font-bold text-[#e35205] hover:text-[#c94804] transition-colors cursor-pointer"
          >
            {action.label} →
          </button>
        </div>
      )}
    </div>
  );
};

export default FinanceCard;
