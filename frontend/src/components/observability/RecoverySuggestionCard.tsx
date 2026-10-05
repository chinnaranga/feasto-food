import React, { useState } from 'react';
import { HelpCircle, RefreshCw, RefreshCcw, Trash2, Check } from 'lucide-react';
import { useRecoverySignals } from '../../hooks/observability/useRecoverySignals';

export const RecoverySuggestionCard: React.FC = () => {
  const { resetApplication, clearDiagnostics } = useRecoverySignals();
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleClearLogs = () => {
    clearDiagnostics();
    setResetCompleted(true);
    setTimeout(() => setResetCompleted(false), 2000);
  };

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border-main bg-secondary-bg flex items-center gap-2.5">
        <HelpCircle size={15} className="text-brand-orange" />
        <h3 className="text-sm font-bold text-text-primary">System Self-Recovery</h3>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          If you are experiencing unexpected behaviors, offline sync latency, or route render blocks, use these tools to restore operational sanity.
        </p>

        <div className="flex flex-col gap-3">
          {/* Option 1: Soft Reload */}
          <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border-main/60 bg-surface-bg/50">
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-0.5">Soft Reload</h4>
              <p className="text-[10px] text-text-muted">Refreshes the active page window and queries live configs.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-brand-orange hover:bg-[#c94804] text-white text-[10px] font-bold rounded-lg transition-main shrink-0 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={10} />
              Reload
            </button>
          </div>

          {/* Option 2: Full System Reset */}
          <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border-main/60 bg-surface-bg/50">
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-0.5">Full System Reset</h4>
              <p className="text-[10px] text-text-muted">Clears all service worker caches, IndexedDB rules, and tokens to query fresh assets.</p>
            </div>
            <button
              onClick={resetApplication}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-main shrink-0 cursor-pointer flex items-center gap-1"
            >
              <RefreshCcw size={10} />
              Reset Cache
            </button>
          </div>

          {/* Option 3: Purge Trace Logs */}
          <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border-main/60 bg-surface-bg/50">
            <div>
              <h4 className="text-xs font-bold text-text-primary mb-0.5">Clear Diagnostic History</h4>
              <p className="text-[10px] text-text-muted">Wipes out the locally stored warning list and route telemetry trace buffers.</p>
            </div>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 bg-surface-bg hover:bg-secondary-bg border border-border-main text-text-secondary text-[10px] font-semibold rounded-lg transition-main shrink-0 cursor-pointer flex items-center gap-1"
            >
              {resetCompleted ? <Check size={10} className="text-emerald-500" /> : <Trash2 size={10} />}
              {resetCompleted ? 'Cleared' : 'Clear Logs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecoverySuggestionCard;
