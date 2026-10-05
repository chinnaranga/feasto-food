import React from 'react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsMonthlyPage: React.FC = () => {
  const { summary } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Monthly Earnings Overview" subtitle="Cumulative monthly pay telemetry and tax settlement readiness." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">July 2026 Total</span>
          <span className="text-2xl font-black text-emerald-700">₹{summary.monthlyTotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Total Monthly Deliveries</span>
            <span className="font-bold text-neutral-900">312 Trips</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">TDS Tax Deducted (1%)</span>
            <span className="font-bold text-neutral-900">₹489.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsMonthlyPage;
