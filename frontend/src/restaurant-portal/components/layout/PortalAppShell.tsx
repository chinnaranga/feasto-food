import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useRouteHealth } from '@/hooks/observability/useRouteHealth';
import { RouteHealthIndicator } from '@/components/observability/RouteHealthIndicator';

import { useEffect } from 'react';
import portalSyncService from '../../services/portalSync';

export const PortalAppShell: React.FC = () => {
  useRouteHealth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    portalSyncService.initializePortalSync();
    return () => {
      portalSyncService.terminatePortalSync();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#ffffff] font-sans antialiased text-[#111827]">
      <RouteHealthIndicator />
      {/* Operations Left Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuToggle={() => setMobileOpen(true)} />
        
        {/* Workspace views content */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default PortalAppShell;
