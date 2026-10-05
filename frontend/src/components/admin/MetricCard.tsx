import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. 12.4 for +12.4%, -3.2 for -3.2%
  changeDescription?: string; // e.g. "vs last week"
  sparklineData?: number[]; // list of numbers to render a clean SVG path sparkline
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeDescription = 'vs last month',
  sparklineData,
  className = '',
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Generate SVG path for sparkline chart
  const getSparklinePath = () => {
    if (!sparklineData || sparklineData.length < 2) return '';
    const width = 100;
    const height = 30;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min === 0 ? 1 : max - min;

    const points = sparklineData.map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={`bg-primary-bg border border-border-main rounded-2xl p-5 shadow-xs flex flex-col justify-between text-left select-none ${className}`}>
      {/* Metric Title */}
      <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
        {title}
      </span>

      {/* Main Stats Row */}
      <div className="flex items-end justify-between gap-4 mt-3">
        <div>
          <span className="text-2xl font-extrabold text-text-primary tracking-tight font-heading">
            {value}
          </span>
          
          {/* Trend Indicator */}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2.5">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-lg border ${
                  isPositive
                    ? 'bg-success-main/5 border-success-main/15 text-success-main'
                    : isNegative
                      ? 'bg-error-main/5 border-error-main/15 text-error-main'
                      : 'bg-text-muted/5 border-border-main text-text-muted'
                }`}
              >
                {isPositive && <ArrowUpRight size={12} />}
                {isNegative && <ArrowDownRight size={12} />}
                {!isPositive && !isNegative && <Minus size={12} />}
                <span>{Math.abs(change)}%</span>
              </span>
              <span className="text-[10px] text-text-muted ml-1">
                {changeDescription}
              </span>
            </div>
          )}
        </div>

        {/* Sparkline Visual Overlay */}
        {sparklineData && sparklineData.length >= 2 && (
          <div className="w-24 h-8 opacity-85 shrink-0 mb-1">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path
                d={getSparklinePath()}
                fill="none"
                stroke={isPositive ? '#10b981' : isNegative ? '#ef4444' : '#94a3b8'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
