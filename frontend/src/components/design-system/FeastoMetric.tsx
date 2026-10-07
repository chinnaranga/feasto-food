import React from 'react';

/**
 * FEASTO METRIC TILE
 * Editorial data visualization: Large numbers, quiet typographic hierarchy,
 * contextual delta pill, minimal hairline borders.
 */

interface FeastoMetricProps {
  label: string;
  value: React.ReactNode;
  delta?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  subtitle?: string;
  index?: string;
  highlight?: boolean;
  dark?: boolean;
  className?: string;
}

export const FeastoMetric: React.FC<FeastoMetricProps> = ({
  label,
  value,
  delta,
  subtitle,
  index,
  highlight = false,
  dark = false,
  className = '',
}) => {
  return (
    <div
      className={`p-5 sm:p-6 border text-left flex flex-col justify-between transition-colors relative overflow-hidden ${
        dark
          ? highlight
            ? 'bg-[#1D212A] border-[#D7F04A]/60 text-white'
            : 'bg-[#14161B] border-white/10 text-white'
          : highlight
          ? 'bg-white border-[#141518] text-[#141518] shadow-sm'
          : 'bg-[#FAF8F5] border-[#E2DED4] text-[#141518]'
      } ${className}`}
    >
      {/* Top Metadata Line */}
      <div className="flex items-start justify-between gap-2 pb-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#8A8D98]">
          {index && <span className="text-[#1B3BFF] font-bold">{index}</span>}
          <span>{label}</span>
        </div>

        {delta && (
          <span
            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border uppercase ${
              delta.neutral
                ? 'bg-stone-100 text-stone-700 border-stone-300'
                : delta.positive
                ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/30'
                : 'bg-[#991B1B]/10 text-[#991B1B] border-[#991B1B]/30'
            }`}
          >
            {delta.positive ? '↑ ' : delta.positive === false ? '↓ ' : ''}
            {delta.value}
          </span>
        )}
      </div>

      {/* Large Typographic Value */}
      <div className="my-2">
        <div className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none text-current">
          {value}
        </div>
      </div>

      {/* Subtitle / Microcontext */}
      {subtitle && (
        <div className="pt-2 border-t border-current/10 font-mono text-[11px] text-[#52555F] dark:text-[#8E929C] truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
