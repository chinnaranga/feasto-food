import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import type { NutritionInfo } from '@/data/restaurants';

interface NutritionTagProps {
  nutrition: NutritionInfo;
  compact?: boolean;
}

export const NutritionTag: React.FC<NutritionTagProps> = ({ nutrition, compact = false }) => {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-muted">
        <Flame size={10} className="text-[#f59e0b]" />
        <span>{nutrition.calories} kcal</span>
      </span>
    );
  }
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-secondary-bg border border-border-main rounded-xl text-[10px] font-bold text-text-secondary">
      <span className="flex items-center gap-1"><Flame size={10} className="text-[#f59e0b]" />{nutrition.calories} kcal</span>
      {nutrition.protein !== undefined && <span className="text-orange-600">{nutrition.protein}g protein</span>}
      {nutrition.carbs !== undefined && <span className="text-blue-500">{nutrition.carbs}g carbs</span>}
      {nutrition.fat !== undefined && <span className="text-text-muted">{nutrition.fat}g fat</span>}
    </div>
  );
};

interface RecommendationBadgeProps {
  score: number;
  label?: string;
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({ score, label }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-orange/5 border border-brand-orange/20 text-[10px] font-extrabold text-brand-orange">
    <Sparkles size={9} className="animate-pulse" />
    {label ?? `${score}% match`}
  </span>
);

export default NutritionTag;
