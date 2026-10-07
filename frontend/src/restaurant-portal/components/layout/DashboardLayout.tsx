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
    <PageContainer className="pb-16 font-mono text-left">
      {/* Header controls strip */}
      <DashboardHeader />

      {/* Segmented control bar */}
      <div className="flex border-b border-[#141518]/15 overflow-x-auto select-none no-scrollbar py-2 text-left shrink-0 bg-[#FAF8F5] mt-6 mb-6 px-3 border border-[#141518]/15 shadow-[3px_3px_0px_#141518]">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? 'bg-[#141518] text-[#FAF8F5] font-bold border-[#141518] shadow-[2px_2px_0px_#141518]'
                    : 'text-[#52555F] hover:text-[#141518] hover:bg-[#EBE7DD] border-transparent'
                }`
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[9px] font-bold leading-none">
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
