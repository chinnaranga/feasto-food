import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { FinancialInsight } from '../../store/portalFinanceStore';

interface FinancialInsightCardProps {
  insight: FinancialInsight;
  onAction?: (insight: FinancialInsight) => void;
}

export const FinancialInsightCard: React.FC<FinancialInsightCardProps> = ({ insight, onAction }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'anomaly':
        return <TrendingUp size={15} className="text-amber-600" />;
      case 'tax-risk':
        return <AlertTriangle size={15} className="text-red-600" />;
      case 'margin-leak':
        return <ShieldAlert size={15} className="text-rose-600" />;
      default:
        return <Sparkles size={15} className="text-[#e35205]" />;
    }
  };

  const getContainerStyle = () => {
    switch (insight.severity) {
      case 'critical':
        return 'bg-red-50/40 border-red-200/80';
      case 'warning':
        return 'bg-amber-50/40 border-amber-200/80';
      default:
        return 'bg-orange-50/30 border-orange-200/60';
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border ${getContainerStyle()} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-all duration-150 hover:shadow-xs`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-white border border-neutral-200/60 shadow-3xs shrink-0 mt-0.5 sm:mt-0">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-neutral-800 tracking-tight">{insight.title}</span>
            {insight.metricImpact && (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-700">
                {insight.metricImpact}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{insight.description}</p>
        </div>
      </div>

      {insight.actionLabel && (
        <button
          onClick={() => onAction?.(insight)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-3xs"
        >
          <span>{insight.actionLabel}</span>
          <ArrowRight size={12} className="text-neutral-400" />
        </button>
      )}
    </div>
  );
};

export default FinancialInsightCard;
