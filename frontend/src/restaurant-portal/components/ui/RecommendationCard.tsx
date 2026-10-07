import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import type { AIInsight } from '../../store/portalDashboardStore';
import usePortalDashboardStore from '../../store/portalDashboardStore';

interface RecommendationCardProps {
  insight: AIInsight;
}

const CATEGORY_CONFIGS = {
  efficiency: {
    bg: 'bg-[#FAF8F5] border-[#141518]/20',
    icon: <Zap size={13} className="text-emerald-700" />,
    pill: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    label: 'Efficiency Insight',
  },
  revenue: {
    bg: 'bg-[#FAF8F5] border-[#141518]/20',
    icon: <TrendingUp size={13} className="text-[#1B3BFF]" />,
    pill: 'bg-[#1B3BFF]/10 text-[#1B3BFF] border-[#1B3BFF]/30',
    label: 'Growth Insight',
  },
  inventory: {
    bg: 'bg-[#FAF8F5] border-[#141518]/20',
    icon: <Target size={13} className="text-[#141518]" />,
    pill: 'bg-[#141518]/10 text-[#141518] border-[#141518]/30',
    label: 'Supply Insight',
  },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ insight }) => {
  const config = CATEGORY_CONFIGS[insight.category] || CATEGORY_CONFIGS.efficiency;
  const { triggerQuickAction } = usePortalDashboardStore();

  return (
    <div className={`border p-4 flex flex-col gap-3 transition-all duration-200 shadow-[3px_3px_0px_#141518] text-left ${config.bg}`}>
      {/* Category header */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider ${config.pill}`}>
          {config.icon}
          {config.label}
        </span>
        <Sparkles size={12} className="text-[#1B3BFF] animate-pulse" />
      </div>

      {/* Suggestion text */}
      <p className="text-xs font-mono font-medium text-[#141518] leading-normal">
        {insight.text}
      </p>

      {/* Action CTA */}
      {insight.actionLabel && (
        <button
          type="button"
          onClick={() => triggerQuickAction(insight.actionLabel || '')}
          className="inline-flex items-center gap-1 self-start font-mono text-[10px] font-black text-[#1B3BFF] hover:text-[#141518] transition-colors cursor-pointer group uppercase tracking-wider"
        >
          <span>{insight.actionLabel}</span>
          <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default RecommendationCard;
