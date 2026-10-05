import React from 'react';
import { GitBranch, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';

export const DeploymentHealth: React.FC = () => {
  const { releases, triggerRollback } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Active Release v2.4.1-prod
            </span>
            <span className="text-xs text-neutral-400 font-bold">100% Progressive Rollout</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Deployment Health & Release Rollback Control
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor active production builds, track post-deploy error regressions, verify stale asset caching, and execute one-click build rollbacks.
          </p>
        </div>
      </div>

      {/* Release Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {releases.map((rel) => (
          <div key={rel.version} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                  {rel.version}
                </span>
                <span className="text-xs font-black text-neutral-800">{rel.releaseName}</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {rel.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-between text-xs">
              <span>Deployed: <strong className="text-neutral-800">{rel.deployedAt}</strong></span>
              <span>Post-Deploy Errors: <strong className="text-neutral-800">{rel.errorCountPostDeploy}</strong></span>
            </div>

            {rel.rollbackAvailable && (
              <div className="flex justify-end">
                <button
                  onClick={() => triggerRollback(rel.version)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Prepare Instant Rollback</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentHealth;
