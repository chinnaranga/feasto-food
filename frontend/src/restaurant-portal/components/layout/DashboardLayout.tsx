import React, { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, History } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalLoader from '../common/PortalLoader';
import DashboardHeader from '../common/DashboardHeader';
import usePortalDashboardStore from '../../store/portalDashboardStore';

export const DashboardLayout: React.FC = () => {
  const { alerts } = usePortalDashboardStore();
  const activeAlertsCount = alerts.filter((a) => !a.dismissed).length;

  const tabs = [
    {
      label: 'Operations Overview',
      path: '/restaurant-portal/dashboard/overview',
      icon: <LayoutDashboard size={13} />,
      badge: null,
    },
    {
      label: 'Alert Feed',
      path: '/restaurant-portal/dashboard/alerts',
      icon: <AlertTriangle size={13} />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
    },
    {
      label: 'Workspace Activity Log',
      path: '/restaurant-portal/dashboard/activity',
      icon: <History size={13} />,
      badge: null,
    },
  ];

  return (
    <PageContainer className="pb-16">
      {/* Header controls strip */}
      <DashboardHeader />

      {/* Segmented control bar */}
      <div className="flex border-b border-neutral-200 overflow-x-auto select-none no-scrollbar py-1 text-left shrink-0 bg-white mt-6 mb-6">
        <nav className="flex gap-1.5 px-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50/50'
                }`
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black leading-none">
                  {tab.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Active Tab Panel */}
      <div className="w-full">
        <Suspense fallback={<PortalLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default DashboardLayout;
