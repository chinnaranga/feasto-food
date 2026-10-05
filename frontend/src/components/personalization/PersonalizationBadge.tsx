import React from 'react';

interface PersonalizationBadgeProps {
  score: number;
}

export const PersonalizationBadge: React.FC<PersonalizationBadgeProps> = ({ score }) => {
  // Determine color matching strength
  const getColors = () => {
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score >= 75) return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
    return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  };

  return (
    <span className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 border rounded-md uppercase tracking-wider ${getColors()}`}>
      ⚡ {score}% Match
    </span>
  );
};

export default PersonalizationBadge;
