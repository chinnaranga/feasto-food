import React from 'react';

import { Achievement } from '@/types/loyalty';

interface AchievementChipProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export const AchievementChip: React.FC<AchievementChipProps> = ({ achievement, isUnlocked }) => {
  return (
    <div
      className={`flex items-center gap-3 p-3.5 border rounded-2xl transition-main text-left bg-white
        ${isUnlocked
          ? 'border-brand-orange/20 shadow-xs'
          : 'border-border-main/40 opacity-55'
        }`}
    >
      <div className="text-2xl select-none shrink-0" role="img" aria-label={achievement.title}>
        {isUnlocked ? achievement.emoji : '🔒'}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-bold text-text-primary">{achievement.title}</h4>
          {isUnlocked && (
            <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 rounded uppercase tracking-wider">
              Unlocked
            </span>
          )}
        </div>
        <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">{achievement.description}</p>
      </div>
    </div>
  );
};
