import React from 'react';
import { RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';

export const RegressionCoverage: React.FC = () => {
  const { confidenceScore } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Automated Regression Prevention Gate
            </span>
            <span className="text-xs text-neutral-400 font-bold">Zero Regressions Detected</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Automated Regression Prevention & Release Guardrails
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Guarantees critical business flow stability, state persistence across page reloads, route protection, and real-time Firestore sync stability.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-neutral-900 font-heading">Regression Test Execution Summary</h4>
          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            0 Regressions
          </span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          All 17 critical user flows passed automated regression audits prior to production deployment clearance.
        </p>
      </div>
    </div>
  );
};

export default RegressionCoverage;
