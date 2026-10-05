import React from 'react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { PayoutStatusBadge } from '../../components/earnings/RiderEarningsComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsPayoutsPage: React.FC = () => {
  const { payouts } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Bank Payout Audit History" subtitle="List of completed and processing bank transfer settlements." />

      <div className="space-y-3">
        {payouts.map((pay) => (
          <div key={pay.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">{pay.timestamp}</span>
                <strong className="text-neutral-900 text-sm block">₹{pay.amount.toFixed(2)}</strong>
              </div>
              <PayoutStatusBadge status={pay.status} />
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-100 text-[11px] text-neutral-500">
              <span>Account: {pay.accountMasked}</span>
              <span>Ref: {pay.referenceTxnId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderEarningsPayoutsPage;
