import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  trendPct?: number; // e.g. 8.2 or -4.5
  trendLabel?: string; // e.g. "vs yesterday"
  subtext?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trendPct,
  trendLabel,
  subtext,
  icon,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="text-left animate-pulse flex flex-col gap-2.5">
        <div className="h-2 w-20 bg-neutral-100 rounded-full" />
        <div className="h-6 w-32 bg-neutral-100 rounded-lg" />
        <div className="h-2 w-24 bg-neutral-100 rounded-full mt-1" />
      </Card>
    );
  }

  const isPositive = trendPct !== undefined && trendPct >= 0;
  const isZero = trendPct !== undefined && trendPct === 0;

  return (
    <Card className="text-left relative overflow-hidden transition-all duration-150 hover:border-[#141518] hover:shadow-[3px_3px_0px_#141518] select-none bg-white border border-[#141518]/20 p-5">
      {/* Header icon row */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] font-bold text-[#8A8D98] uppercase tracking-widest block">
          {title}
        </span>
        {icon && <div className="text-[#141518] shrink-0">{icon}</div>}
      </div>

      {/* Main value display */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading font-black text-2xl sm:text-3xl text-[#141518] leading-none tracking-tight">
          {value}
        </span>
      </div>

      {/* Trend indicators */}
      {trendPct !== undefined && (
        <div className="flex items-center gap-2 mt-2.5 font-mono">
          <div
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-black uppercase border ${
              isZero
                ? 'bg-[#FAF8F5] text-[#8A8D98] border-[#141518]/20'
                : isPositive
                ? 'bg-emerald-50 text-[#15803D] border-emerald-300'
                : 'bg-red-50 text-[#991B1B] border-red-300'
            }`}
          >
            {isZero ? null : isPositive ? (
              <ArrowUpRight size={10} strokeWidth={3} />
            ) : (
              <ArrowDownRight size={10} strokeWidth={3} />
            )}
            <span>{Math.abs(trendPct)}%</span>
          </div>
          {trendLabel && (
            <span className="text-[10px] text-[#8A8D98] font-bold">{trendLabel}</span>
          )}
        </div>
      )}

      {subtext && !trendPct && (
        <p className="font-mono text-[10px] text-[#8A8D98] mt-2">{subtext}</p>
      )}
    </Card>
  );
};

export default MetricCard;
