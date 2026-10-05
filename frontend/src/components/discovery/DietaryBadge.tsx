import React from 'react';
import type { DietaryTag } from '@/data/restaurants';

const DIETARY_STYLES: Record<string, string> = {
  Vegan: 'bg-green-50 text-green-700 border-green-200',
  Vegetarian: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Gluten Free': 'bg-amber-50 text-amber-700 border-amber-200',
  'Dairy Free': 'bg-blue-50 text-blue-700 border-blue-200',
  Halal: 'bg-teal-50 text-teal-700 border-teal-200',
  Keto: 'bg-purple-50 text-purple-700 border-purple-200',
  'High Protein': 'bg-orange-50 text-orange-700 border-orange-200',
  'Low Carb': 'bg-sky-50 text-sky-700 border-sky-200',
  Healthy: 'bg-lime-50 text-lime-700 border-lime-200',
  'Omega-3': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Anti-inflammatory': 'bg-rose-50 text-rose-700 border-rose-200',
};

interface DietaryBadgeProps {
  tag: DietaryTag | string;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ tag }) => {
  const style = DIETARY_STYLES[tag] ?? 'bg-secondary-bg text-text-muted border-border-main';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-wide ${style}`}>
      {tag}
    </span>
  );
};

export default DietaryBadge;
