import React from 'react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsBreakdownPage: React.FC = () => {
  const { trips } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Itemized Per-Trip Earnings" subtitle="Complete breakdown of base fees, distance pay, tips, and surge bonuses per order." />

      <div className="space-y-3">
        {trips.map((tr) => (
          <div key={tr.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{tr.orderNumber} • {tr.timestamp}</span>
                <h4 className="text-sm font-black text-neutral-900 font-heading">{tr.restaurantName}</h4>
              </div>
              <span className="text-base font-black font-mono text-emerald-700">₹{tr.netPay.toFixed(0)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-center">
              <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-neutral-400 text-[9px] block">Base Pay</span>
                <strong className="text-neutral-900">₹{tr.basePay}</strong>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-neutral-400 text-[9px] block">Distance</span>
                <strong className="text-neutral-900">₹{tr.distancePay}</strong>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-amber-700 text-[9px] block">Surge</span>
                <strong className="text-amber-800">₹{tr.surgeBonus}</strong>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 text-[9px] block">Tip</span>
                <strong className="text-emerald-800">₹{tr.tipAmount}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderEarningsBreakdownPage;
