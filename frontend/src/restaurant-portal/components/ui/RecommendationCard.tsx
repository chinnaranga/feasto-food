import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import type { AIInsight } from '../../store/portalDashboardStore';
import usePortalDashboardStore from '../../store/portalDashboardStore';

interface RecommendationCardProps {
  insight: AIInsight;
}

const CATEGORY_CONFIGS = {
  efficiency: {
    bg: 'bg-emerald-50/40 border-emerald-100',
    icon: <Zap size={13} className="text-emerald-600" />,
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Efficiency Insight',
  },
  revenue: {
    bg: 'bg-orange-50/30 border-orange-100',
    icon: <TrendingUp size={13} className="text-[#e35205]" />,
    pill: 'bg-orange-50 text-[#e35205] border-orange-200',
    label: 'Growth Insight',
  },
  inventory: {
    bg: 'bg-indigo-50/30 border-indigo-100',
    icon: <Target size={13} className="text-indigo-600" />,
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    label: 'Supply Insight',
  },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ insight }) => {
  const config = CATEGORY_CONFIGS[insight.category] || CATEGORY_CONFIGS.efficiency;
  const { triggerQuickAction } = usePortalDashboardStore();

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-xs text-left ${config.bg}`}>
      {/* Category header */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${config.pill}`}>
          {config.icon}
          {config.label}
        </span>
        <Sparkles size={11} className="text-[#e35205]/40 animate-pulse" />
      </div>

      {/* Suggestion text */}
      <p className="text-[11px] font-semibold text-neutral-700 leading-normal">
        {insight.text}
      </p>

      {/* Action CTA */}
      {insight.actionLabel && (
        <button
          type="button"
          onClick={() => triggerQuickAction(insight.actionLabel || '')}
          className="inline-flex items-center gap-1 self-start text-[10px] font-black text-[#e35205] hover:text-[#c94804] transition-colors cursor-pointer group"
        >
          <span>{insight.actionLabel}</span>
          <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default RecommendationCard;
