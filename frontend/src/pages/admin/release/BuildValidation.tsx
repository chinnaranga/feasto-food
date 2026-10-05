import React from 'react';
import { CheckCircle2, Play, Terminal } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';
import { BuildCheckItemWidget } from './ReleaseComponents';

export const BuildValidation: React.FC = () => {
  const { buildChecks, runBuildChecks } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Automated CI/CD Build Verification Suite
            </span>
            <span className="text-xs text-neutral-400 font-bold">Vite + TypeScript + ESLint</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Build Verification & Pre-Deployment Audits
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Validate strict TypeScript compilation, ESLint code security, bundle chunk sizes, React Router tree integrity, and PWA manifest readiness.
          </p>
        </div>

        <button
          onClick={runBuildChecks}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <Play size={13} />
          <span>Re-Run All Checks</span>
        </button>
      </div>

      {/* Build Checks List */}
      <div className="space-y-3">
        {buildChecks.map((check) => (
          <BuildCheckItemWidget key={check.id} check={check} />
        ))}
      </div>
    </div>
  );
};

export default BuildValidation;
