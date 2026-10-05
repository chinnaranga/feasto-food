import React from 'react';
import { Sparkles } from 'lucide-react';
import { useRewardsBalance } from '@/hooks/loyalty/useRewardsBalance';

export const RewardsProgressBar: React.FC = () => {
  const { points, pointsNeeded, progressPercent } = useRewardsBalance();

  return (
    <div className="p-5 bg-secondary-bg/30 border border-border-main/50 rounded-2xl text-left w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={11} className="text-brand-orange" />
          <span>Next Reward Milestone</span>
        </span>
        <span className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/5 border border-brand-orange/10 px-1.5 py-0.5 rounded">
          {pointsNeeded > 0 ? `${pointsNeeded} pts left` : 'Unlocked!'}
        </span>
      </div>

      <div className="w-full bg-border-main/40 h-2 rounded-full overflow-hidden mb-2.5">
        <div
          className="bg-brand-orange h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-[9px] text-text-muted font-medium">
        Currently at {points} points. Reach 500 points to unlock a premium reward coupon or convert to ₹50 credits.
      </p>
    </div>
  );
};
