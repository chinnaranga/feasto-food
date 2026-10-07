import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderNavigationAlertsPage: React.FC = () => {
  const { alerts, dismissAlert, triggerReroute } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="NAVIGATION & GPS TELEMETRY ALERTS"
        subtitle="Route traffic alerts, satellite lock updates, and optimal reroute suggestions."
      />

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2 text-xs relative font-mono"
            >
              <div className="flex items-start justify-between">
                <strong className="font-black uppercase text-[#141518] pr-6">{alt.title}</strong>
                <button
                  onClick={() => dismissAlert(alt.id)}
                  className="p-1 border border-[#141518] bg-[#FAF8F5] hover:bg-[#F3F0E8] text-[#141518] absolute top-3 right-3 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <p className="text-[#55565B] leading-relaxed font-sans">{alt.message}</p>

              {alt.actionLabel && (
                <button
                  onClick={triggerReroute}
                  className="text-xs font-mono font-bold text-[#141518] underline underline-offset-4 decoration-[#D7F04A] decoration-2 hover:text-[#1B3BFF] block pt-1 cursor-pointer uppercase"
                >
                  {alt.actionLabel} →
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState
          title="NO ACTIVE NAVIGATION ALERTS"
          description="GPS satellite lock is solid (3m RTK precision) and route arterials are running clear."
        />
      )}
    </div>
  );
};

export default RiderNavigationAlertsPage;
