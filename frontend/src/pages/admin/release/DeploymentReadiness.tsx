import React from 'react';
import { ShieldCheck, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';

export const DeploymentReadiness: React.FC = () => {
  const { deploymentGate } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Production Gate Approved
            </span>
            <span className="text-xs text-neutral-400 font-bold">Staging & Preview Clearance</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Production Deployment Gate & Pre-Launch Clearance
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Verify preview deployment builds, confirm route refresh safety, audit critical fallback paths, and clear the production launch gate.
          </p>
        </div>
      </div>

      {/* Deployment Gate Specs Card */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h4 className="text-sm font-black text-neutral-900 font-heading">Production Launch Clearance Status</h4>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {deploymentGate.gateStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Preview Environment Build</span>
            <a
              href={deploymentGate.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#e35205] hover:underline flex items-center gap-1"
            >
              <span>{deploymentGate.previewUrl}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Validated By</span>
            <span className="font-bold text-neutral-800">{deploymentGate.validatedBy} ({deploymentGate.lastValidatedAt})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentReadiness;
