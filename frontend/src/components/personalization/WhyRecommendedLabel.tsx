import React from 'react';
import { Sparkles, Clock, ShieldAlert, Heart, TrendingUp, CircleDollarSign } from 'lucide-react';
import { RecommendationCategory } from '@/types/personalization';

interface WhyRecommendedLabelProps {
  category: RecommendationCategory;
  text: string;
  className?: string;
}

export const WhyRecommendedLabel: React.FC<WhyRecommendedLabelProps> = ({ category, text, className = '' }) => {
  const getIcon = () => {
    switch (category) {
      case 'dietary':
        return <ShieldAlert size={11} className="text-emerald-500" />;
      case 'time_of_day':
        return <Clock size={11} className="text-blue-500" />;
      case 'recency':
      case 'favorites':
        return <Heart size={11} className="text-red-500" />;
      case 'budget':
        return <CircleDollarSign size={11} className="text-amber-500" />;
      case 'cuisine_affinity':
        return <Sparkles size={11} className="text-brand-orange animate-pulse" />;
      default:
        return <TrendingUp size={11} className="text-text-muted" />;
    }
  };

  const getBgStyle = () => {
    switch (category) {
      case 'dietary':
        return 'bg-emerald-50/70 border-emerald-100/60 text-emerald-800';
      case 'time_of_day':
        return 'bg-blue-50/70 border-blue-100/60 text-blue-800';
      case 'favorites':
        return 'bg-red-50/70 border-red-100/60 text-red-800';
      case 'budget':
        return 'bg-amber-50/70 border-amber-100/60 text-amber-800';
      case 'cuisine_affinity':
        return 'bg-orange-50/70 border-orange-100/60 text-brand-orange';
      default:
        return 'bg-surface-bg border-border-main/50 text-text-secondary';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-main ${getBgStyle()} ${className}`}
    >
      {getIcon()}
      <span className="truncate">{text}</span>
    </span>
  );
};

export default WhyRecommendedLabel;
