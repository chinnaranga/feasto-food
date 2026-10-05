import React from 'react';
import { Navigation, Clock, MapPin, ShieldCheck } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActiveRoutePage: React.FC = () => {
  const { activeTask, aiInsight } = useRiderActiveStore();

  if (!activeTask) {
    return <RiderEmptyState title="No Active Route" description="Accept an order offer to inspect route telemetry." />;
  }

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Route Execution Telemetry" subtitle={`Total Distance: ${activeTask.totalDistanceKm} km`} />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs font-mono">
        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">Remaining Distance</span>
          <span className="font-bold text-neutral-900">{activeTask.distanceRemainingKm} km</span>
        </div>

        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">Estimated Delivery ETA</span>
          <span className="font-bold text-emerald-700">{activeTask.estimatedEtaMins} mins</span>
        </div>

        <div className="flex justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-neutral-500">AI Route Optimization</span>
          <span className="font-bold text-neutral-900">{aiInsight.routeEfficiencyTip}</span>
        </div>
      </div>
    </div>
  );
};

export default RiderActiveRoutePage;
