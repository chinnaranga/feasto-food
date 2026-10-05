import React from 'react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderEarningsDeductionsPage: React.FC = () => {
  const { deductions } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Deductions & Adjustments Audit" subtitle="Audit log of platform service adjustments, TDS tax, or policy deductions." />

      {deductions.length > 0 ? (
        <div className="space-y-3">
          {deductions.map((d) => (
            <div key={d.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <strong className="font-bold text-neutral-900">{d.title}</strong>
                <span className="text-emerald-700 font-bold">₹{d.amount.toFixed(2)}</span>
              </div>
              <p className="text-neutral-500 font-sans">{d.reasonNote}</p>
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState title="Zero Deductions" description="No platform deductions or policy penalties have been charged." />
      )}
    </div>
  );
};

export default RiderEarningsDeductionsPage;
