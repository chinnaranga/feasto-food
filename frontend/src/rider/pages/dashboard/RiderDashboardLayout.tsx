import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import useRiderStore from '../../store/useRiderStore';
import { DashboardTopBar, DashboardSubNavTabBar } from '../../components/dashboard/RiderDashboardComponents';

export const RiderDashboardLayout: React.FC = () => {
  const { dutyState, assignedZone, alerts, toggleDutyState } = useRiderDashboardStore();
  const { toggleDrawer } = useRiderStore();

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-4 text-left">
      {/* Sub-Nav Scrollable Tab Bar */}
      <DashboardSubNavTabBar />

      {/* Main View Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Dashboard Module...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RiderDashboardLayout;
