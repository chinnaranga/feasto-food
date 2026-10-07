import React from 'react';
import { Award, Zap } from 'lucide-react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsBonusesPage: React.FC = () => {
  const { bonuses } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="INCENTIVES & SURGE QUESTS"
        subtitle="Active weekend quests, peak hour surge rewards, and performance streaks."
      />

      <div className="space-y-3">
        {bonuses.map((b) => (
          <div
            key={b.id}
            className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 text-xs font-mono"
          >
            <div className="flex items-center justify-between border-b border-[#141518]/15 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#D7F04A] border border-[#141518] text-[#141518]">
                  <Award size={16} />
                </div>
                <h4 className="text-sm font-heading font-black text-[#141518] uppercase tracking-tight">
                  {b.title}
                </h4>
              </div>
              <span className="text-sm font-black font-mono px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
                +₹{b.bonusRewardAmount}
              </span>
            </div>

            <p className="text-[#55565B] leading-relaxed font-sans">{b.description}</p>

            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-[10px] text-[#55565B]">
                <span>PROGRESS: {b.completedTrips} / {b.targetTrips} DROPS</span>
                <span>{b.expiryTime}</span>
              </div>
              <div className="w-full h-2.5 bg-[#F3F0E8] border border-[#141518] overflow-hidden">
                <div
                  className="h-full bg-[#141518] transition-all"
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
