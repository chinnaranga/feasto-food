import React from 'react';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsWeeklyPage: React.FC = () => {
  const { summary } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Weekly Earnings Overview" subtitle="Total earnings accumulated during the current working week." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Current Week Total</span>
          <span className="text-2xl font-black text-emerald-700">₹{summary.weeklyTotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Highest Earning Day</span>
            <span className="font-bold text-neutral-900">Friday (₹2,840)</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Weekly Deliveries Completed</span>
            <span className="font-bold text-neutral-900">84 Trips</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Quest Bonuses Unlocked</span>
            <span className="font-bold text-emerald-700">+₹750</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsWeeklyPage;
