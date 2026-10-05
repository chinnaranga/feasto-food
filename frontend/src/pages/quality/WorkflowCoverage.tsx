import React from 'react';
import { ListCheck, CheckCircle2 } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';
import { WorkflowCoverageCard } from './QualityComponents';

export const WorkflowCoverage: React.FC = () => {
  const { workflows } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● 17 Critical Business Workflows Covered
            </span>
            <span className="text-xs text-neutral-400 font-bold">100% Path Coverage</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            End-to-End Business Workflow Coverage Matrix
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Verify automated end-to-end coverage across authentication, onboarding, dish creation, KDS order fulfillment, payout reconciliation, and security request flows.
          </p>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((item) => (
          <WorkflowCoverageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default WorkflowCoverage;
