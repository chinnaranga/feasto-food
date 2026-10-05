import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderNavigationStore from '../../store/useRiderNavigationStore';
import { GPSStatusBadge, NavigationSubNavTabBar } from '../../components/navigation/RiderNavigationComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderNavigationLayout: React.FC = () => {
  const { routeSummary } = useRiderNavigationStore();

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <RiderPageHeader
          title={`Live GPS Navigation ${routeSummary.orderNumber}`}
          subtitle={`Route to ${routeSummary.currentStage === 'nav_to_pickup' ? 'Restaurant Pickup' : 'Customer Dropoff'}`}
        />
        <GPSStatusBadge status={routeSummary.gpsSignal} />
      </div>

      {/* Sub-Nav Scrollable Tab Bar */}
      <NavigationSubNavTabBar />

      {/* Main Navigation View Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Map Navigation...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RiderNavigationLayout;
