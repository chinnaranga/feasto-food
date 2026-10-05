import React from 'react';
import { Wallet, TrendingUp, Clock, Award, Navigation } from 'lucide-react';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderDashboardSummaryPage: React.FC = () => {
  const { summary } = useRiderDashboardStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Daily Operational Summary" subtitle="Comprehensive snapshot of completed deliveries, payout totals, and trip mileage." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Today's Total Payout</span>
          <span className="text-xl font-black font-mono text-emerald-700">₹{summary.todayEarnings.toFixed(2)}</span>
        </div>

        <div className="space-y-2 font-mono">
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-600">Completed Orders ({summary.todayTrips} Trips)</span>
            <span className="font-bold text-neutral-900">₹1,140</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-600">Customer Tips (Direct)</span>
            <span className="font-bold text-emerald-700">+₹{summary.todayTips}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-600">Quest Surge Incentive</span>
            <span className="font-bold text-emerald-700">+₹{summary.questBonusEarned}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-600">Total Distance Traveled</span>
            <span className="font-bold text-neutral-900">{summary.todayDistanceKm} km</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-600">Total Online Duty Hours</span>
            <span className="font-bold text-neutral-900">
              {Math.floor(summary.todayOnlineMinutes / 60)}h {summary.todayOnlineMinutes % 60}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboardSummaryPage;
