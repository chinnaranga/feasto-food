import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { BranchReadinessCard } from './BranchComponents';

export const BranchReadinessPage: React.FC = () => {
  const { branches, readinessScores } = usePortalBranchesStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🚀 Operational Readiness Audits
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Branch Launch & Operational Readiness Telemetry
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Audit location profile completeness, operating hours setup, shift staffing readiness, menu availability, and delivery zone coverage before launching online ordering.
          </p>
        </div>
      </div>

      {/* Readiness Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <BranchReadinessCard
            key={b.id}
            branchName={b.name}
            readiness={readinessScores[b.id] || { branchId: b.id, profileScorePct: 90, hoursScorePct: 100, staffScorePct: 80, menuScorePct: 90, inventoryScorePct: 85, deliveryScorePct: 80, overallReadinessPct: 87, blockersCount: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchReadinessPage;
