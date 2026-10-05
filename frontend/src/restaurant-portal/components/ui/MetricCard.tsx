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
    <Card className="text-left relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-neutral-300 select-none">
      {/* Header icon row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
          {title}
        </span>
        {icon && <div className="text-neutral-400 shrink-0">{icon}</div>}
      </div>

      {/* Main value display */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-black text-neutral-800 leading-none tracking-tight">
          {value}
        </span>
      </div>

      {/* Trend indicators */}
      {trendPct !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <div
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black ${
              isZero
                ? 'bg-neutral-100 text-neutral-500'
                : isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {isZero ? null : isPositive ? (
              <ArrowUpRight size={9} strokeWidth={3} />
            ) : (
              <ArrowDownRight size={9} strokeWidth={3} />
            )}
            <span>{Math.abs(trendPct)}%</span>
          </div>
          {trendLabel && (
            <span className="text-[10px] text-neutral-400 font-medium">{trendLabel}</span>
          )}
        </div>
      )}

      {subtext && !trendPct && (
        <p className="text-[10px] text-neutral-400 font-medium mt-2">{subtext}</p>
      )}
    </Card>
  );
};

export default MetricCard;
