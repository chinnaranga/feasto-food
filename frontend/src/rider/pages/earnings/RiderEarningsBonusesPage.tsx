import React from 'react';
import { Award, Zap } from 'lucide-react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsBonusesPage: React.FC = () => {
  const { bonuses } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Incentives & Quest Bonuses" subtitle="Active weekend quests, peak hour surge rewards, and streak bonuses." />

      <div className="space-y-3">
        {bonuses.map((b) => (
          <div key={b.id} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#e35205]" />
                <h4 className="text-sm font-black text-neutral-900 font-heading">{b.title}</h4>
              </div>
              <span className="text-sm font-black font-mono text-emerald-700">+₹{b.bonusRewardAmount}</span>
            </div>

            <p className="text-neutral-600 leading-relaxed">{b.description}</p>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-neutral-500">
                <span>Progress: {b.completedTrips} / {b.targetTrips} Trips</span>
                <span>{b.expiryTime}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (b.completedTrips / b.targetTrips) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderEarningsBonusesPage;
