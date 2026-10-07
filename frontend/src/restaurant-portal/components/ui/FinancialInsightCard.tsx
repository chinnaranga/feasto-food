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
        return <TrendingUp size={15} className="text-amber-700" />;
      case 'tax-risk':
        return <AlertTriangle size={15} className="text-red-700" />;
      case 'margin-leak':
        return <ShieldAlert size={15} className="text-rose-700" />;
      default:
        return <Sparkles size={15} className="text-[#1B3BFF]" />;
    }
  };

  const getContainerStyle = () => {
    switch (insight.severity) {
      case 'critical':
        return 'bg-red-50/60 border-red-300';
      case 'warning':
        return 'bg-amber-50/60 border-amber-300';
      default:
        return 'bg-[#FAF8F5] border-[#141518]/20 shadow-[3px_3px_0px_#141518]';
    }
  };

  return (
    <div
      className={`p-4 border ${getContainerStyle()} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-all duration-150`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 bg-[#F3F0E8] border border-[#141518]/20 shrink-0 mt-0.5 sm:mt-0">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-xs uppercase tracking-tight text-[#141518]">{insight.title}</span>
            {insight.metricImpact && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#141518] text-[#D7F04A]">
                {insight.metricImpact}
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-[#52555F] mt-1 leading-relaxed">{insight.description}</p>
        </div>
      </div>

      {insight.actionLabel && (
        <button
          onClick={() => onAction?.(insight)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] border border-[#141518] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-[2px_2px_0px_#141518]"
        >
          <span>{insight.actionLabel}</span>
          <ArrowRight size={10} />
        </button>
      )}
    </div>
  );
};

export default FinancialInsightCard;
