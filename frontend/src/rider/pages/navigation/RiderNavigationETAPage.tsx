import React from 'react';
import { Clock, Navigation, Sparkles } from 'lucide-react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationETAPage: React.FC = () => {
  const { routeSummary, aiInsight } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="ETA & Distance Telemetry" subtitle="Dynamic ETA calculation and traffic delay breakdown." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs font-mono">
        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">Estimated Delivery Time</span>
          <span className="font-bold text-emerald-700">{routeSummary.estimatedEtaMins} Mins</span>
        </div>

        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">Total Route Distance</span>
          <span className="font-bold text-neutral-900">{routeSummary.distanceRemainingKm} / {routeSummary.totalDistanceKm} KM</span>
        </div>

        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">AI ETA Confidence</span>
          <span className="font-bold text-emerald-700">{aiInsight.etaConfidenceScorePct}% SLA Rating</span>
        </div>
      </div>
    </div>
  );
};

export default RiderNavigationETAPage;
