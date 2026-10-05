import React from 'react';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { LiveMapCard } from '../../components/navigation/RiderNavigationComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationMapPage: React.FC = () => {
  const { routeSummary, recenterMap, triggerReroute } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Interactive Map Canvas" subtitle="Full viewport route inspection and waypoint visualization." />
      <LiveMapCard routeSummary={routeSummary} onRecenter={recenterMap} onReroute={triggerReroute} />
    </div>
  );
};

export default RiderNavigationMapPage;
