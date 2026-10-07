import React from 'react';

/**
 * FEASTO TIMELINE
 * Architectural vertical or horizontal chronological execution tracker.
 */

export interface FeastoTimelineStep {
  id: string;
  label: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

interface FeastoTimelineProps {
  steps: FeastoTimelineStep[];
  orientation?: 'vertical' | 'horizontal';
  dark?: boolean;
  className?: string;
}

export const FeastoTimeline: React.FC<FeastoTimelineProps> = ({
  steps,
  orientation = 'vertical',
  dark = false,
  className = '',
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-start justify-between w-full text-left ${className}`}>
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'current';
          return (
            <div key={step.id} className="flex-1 flex flex-col relative pr-4 last:pr-0">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-2 left-4 right-0 h-px ${
                    isDone ? 'bg-[#141518] dark:bg-white' : 'bg-[#E2DED4] dark:bg-white/10'
                  }`}
                />
              )}
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span
                  className={`w-4 h-4 flex items-center justify-center font-mono text-[9px] font-bold border ${
                    isDone
                      ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] dark:bg-white dark:text-[#141518]'
                      : isCurrent
                      ? 'bg-[#D7F04A] text-[#141518] border-[#141518] animate-pulse'
                      : 'bg-transparent text-[#8A8D98] border-[#E2DED4] dark:border-white/20'
                  }`}
                >
                  {idx + 1}
                </span>
              </div>
              <span className="font-heading font-bold text-xs uppercase tracking-tight text-current block truncate">
                {step.label}
              </span>
              {step.timestamp && (
                <span className="font-mono text-[10px] text-[#8A8D98] block mt-0.5">
                  {step.timestamp}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-4 text-left ${className}`}>
      {steps.map((step, idx) => {
        const isDone = step.status === 'completed';
        const isCurrent = step.status === 'current';
        return (
          <div key={step.id} className="flex items-start gap-3 relative">
            {idx < steps.length - 1 && (
              <div
                className={`absolute left-2 top-4 bottom-[-16px] w-px ${
                  isDone ? 'bg-[#141518] dark:bg-white' : 'bg-[#E2DED4] dark:bg-white/10'
                }`}
              />
            )}
            <span
              className={`w-4 h-4 shrink-0 flex items-center justify-center font-mono text-[9px] font-bold border relative z-10 ${
                isDone
                  ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] dark:bg-white dark:text-[#141518]'
                  : isCurrent
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] animate-pulse'
                  : 'bg-transparent text-[#8A8D98] border-[#E2DED4] dark:border-white/20'
              }`}
            >
              {idx + 1}
            </span>
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-current">
                  {step.label}
                </span>
                {step.timestamp && (
                  <span className="font-mono text-[10px] text-[#8A8D98]">{step.timestamp}</span>
                )}
              </div>
              {step.description && (
                <p
                  className={`text-xs mt-0.5 font-sans leading-relaxed ${
                    dark ? 'text-[#8E929C]' : 'text-[#52555F]'
                  }`}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
