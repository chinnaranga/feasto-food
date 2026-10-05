import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileReadinessPage: React.FC = () => {
  const { readiness } = useRiderProfileStore();

  const categories = [
    { label: 'Personal Information Completeness', score: readiness.profileCompletenessScorePct },
    { label: 'Vehicle Registration & RC Validated', score: readiness.vehicleReadinessScorePct },
    { label: 'Compliance Document Audit SLA', score: readiness.documentStatusScorePct },
    { label: 'Shift Availability & Schedule Readiness', score: readiness.availabilityScorePct },
    { label: 'Bank Payout & KYC Status', score: readiness.payoutReadinessScorePct },
  ];

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader
        title="Operational Readiness Audit"
        subtitle="Real-time compliance score calculation and operational readiness checks."
      />

      {/* Overall Score Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-modal space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            Overall Readiness Rating
          </span>
          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            100% Operational SLA
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black font-mono text-emerald-400 leading-none">
            {readiness.overallScorePct}%
          </h3>
          <span className="text-xs text-neutral-400">Ready for Live Delivery Shifts</span>
        </div>
      </div>

      {/* Readiness Category Breakdown */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">Readiness Category Breakdown</h4>

        <div className="space-y-3 text-xs">
          {categories.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between font-bold text-neutral-800">
                <span>{c.label}</span>
                <span className="font-mono text-emerald-700">{c.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${c.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderProfileReadinessPage;
