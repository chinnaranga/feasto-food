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
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'danger':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'brand':
        return 'bg-[#1B3BFF]/10 text-[#1B3BFF] border-[#1B3BFF]/30';
      default:
        return 'bg-[#141518]/5 text-[#52555F] border-[#141518]/15';
    }
  };

  return (
    <div
      className={`p-5 bg-[#FAF8F5] border border-[#141518]/20 shadow-[4px_4px_0px_#141518] transition-all duration-200 text-left relative flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-[10px] font-bold text-[#52555F] uppercase tracking-wider truncate">
              {title}
            </span>
            {tooltip && (
              <span className="text-[#52555F]/60 hover:text-[#141518] cursor-help transition-colors" title={tooltip}>
                <HelpCircle size={12} />
              </span>
            )}
          </div>
          {badge && (
            <span
              className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${getBadgeStyle(
                badge.variant
              )}`}
            >
              {badge.text}
            </span>
          )}
          {icon && <div className="p-1.5 bg-[#F3F0E8] text-[#141518] border border-[#141518]/15">{icon}</div>}
        </div>

        {/* Amount */}
        <div className="mt-3 flex items-baseline gap-2">
          <h3 className="font-heading font-black text-2xl text-[#141518] tracking-tight">{amount}</h3>
          {trend && (
            <div
              className={`inline-flex items-center gap-0.5 font-mono text-xs font-bold ${
                trend.isPositive
                  ? 'text-emerald-700'
                  : trend.isNegative
                  ? 'text-red-700'
                  : 'text-[#52555F]'
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
          <p className="mt-1 font-mono text-[10px] font-bold text-[#52555F]">
            {subtitle || trend?.label}
          </p>
        )}
      </div>

      {/* Optional action footer */}
      {action && (
        <div className="mt-4 pt-3 border-t border-[#141518]/10 flex justify-end">
          <button
            onClick={action.onClick}
            className="font-mono text-[11px] font-bold text-[#1B3BFF] hover:text-[#141518] transition-colors cursor-pointer uppercase tracking-wider"
          >
            {action.label} →
          </button>
        </div>
      )}
    </div>
  );
};

export default FinanceCard;
