import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderNavigationAlertsPage: React.FC = () => {
  const { alerts, dismissAlert, triggerReroute } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Navigation & GPS Telemetry Alerts" subtitle="Route traffic alerts, signal updates, and reroute suggestions." />

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div key={alt.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs relative">
              <div className="flex items-start justify-between">
                <strong className="font-bold text-neutral-900 pr-6">{alt.title}</strong>
                <button
                  onClick={() => dismissAlert(alt.id)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 absolute top-3 right-3 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-neutral-600 leading-relaxed">{alt.message}</p>

              {alt.actionLabel && (
                <button
                  onClick={triggerReroute}
                  className="text-xs font-bold text-[#e35205] hover:underline block pt-1 cursor-pointer"
                >
                  {alt.actionLabel} →
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState title="No Active Navigation Alerts" description="Your GPS signal is locked and traffic conditions are clear." />
      )}
    </div>
  );
};

export default RiderNavigationAlertsPage;
