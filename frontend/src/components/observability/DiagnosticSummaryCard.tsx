import React from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useObservabilityStore } from '../../store/observability/observabilityStore';
import { ClientHealthBadge } from './ClientHealthBadge';

export const DiagnosticSummaryCard: React.FC = () => {
  const { events, telemetryConsent, setTelemetryConsent, lastActions } = useObservabilityStore();

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border-main bg-secondary-bg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield size={15} className="text-brand-orange" />
          <h3 className="text-sm font-bold text-text-primary">Observability Status</h3>
        </div>
        <ClientHealthBadge />
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Toggle Telemetry Consent */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border-main/60 bg-surface-bg/50">
          <div className="flex gap-2">
            {telemetryConsent ? (
              <Eye size={16} className="text-brand-orange shrink-0 mt-0.5" />
            ) : (
              <EyeOff size={16} className="text-text-muted shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-text-primary">Anonymous Logs Telemetry</h4>
              <p className="text-[10px] text-text-muted">Sends anonymous diagnostic signals to help improve application speed.</p>
            </div>
          </div>
          <button
            onClick={() => setTelemetryConsent(!telemetryConsent)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-main cursor-pointer border ${
              telemetryConsent
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-surface-bg border-border-main text-text-secondary'
            }`}
          >
            {telemetryConsent ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Diagnostic Logs Summary */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl border border-border-main bg-secondary-bg">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Active Logs Size
            </span>
            <span className="text-xl font-black text-text-primary block leading-none">
              {events.length} <span className="text-xs font-semibold text-text-secondary">/ 50</span>
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border-main bg-secondary-bg">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              User Actions Stack
            </span>
            <span className="text-xl font-black text-text-primary block leading-none">
              {lastActions.length} <span className="text-xs font-semibold text-text-secondary">/ 10</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DiagnosticSummaryCard;
