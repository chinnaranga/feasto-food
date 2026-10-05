import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';

export const RollbackSupport: React.FC = () => {
  const { rollbackState, triggerRollback } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Automated Build Rollback Engine
            </span>
            <span className="text-xs text-neutral-400 font-bold">Fallback Build: {rollbackState.previousVersion}</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Rollback Support & Emergency Build Revert Desk
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Maintains previous production build awareness (`v2.4.0-prod`), guarantees instant DNS & CDN edge build reverts during critical production incidents.
          </p>
        </div>

        {rollbackState.rollbackStatus === 'idle' && (
          <button
            onClick={triggerRollback}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
          >
            <RotateCcw size={14} />
            <span>Trigger Rollback to {rollbackState.previousVersion}</span>
          </button>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-neutral-900 font-heading">Rollback Engine Status</h4>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {rollbackState.rollbackStatus === 'reverted' ? 'REVERTED' : 'ENABLED & IDLE'}
          </span>
        </div>
        <p className="text-xs text-neutral-500">
          Previous build bundle <code className="bg-neutral-100 px-1 font-mono">{rollbackState.previousVersion}</code> is cached and verified ready for instant 1-click fallback deployment.
        </p>
      </div>
    </div>
  );
};

export default RollbackSupport;
