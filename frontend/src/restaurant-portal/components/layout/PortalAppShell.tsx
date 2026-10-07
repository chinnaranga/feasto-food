import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useRouteHealth } from '@/hooks/observability/useRouteHealth';
import { RouteHealthIndicator } from '@/components/observability/RouteHealthIndicator';
import portalSyncService from '../../services/portalSync';

/**
 * FEASTO RESTAURANT STUDIO SHELL
 * Operational, editorial workspace for kitchen and merchant operations.
 * Shares the tactile Feasto paper canvas, crisp hairlines, and typography.
 */
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
    <div className="flex min-h-screen bg-[#F3F0E8] text-[#141518] font-sans antialiased selection:bg-[#D7F04A] selection:text-[#141518]">
      <RouteHealthIndicator />

      {/* Restaurant Studio Left Bezel / Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Studio Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar onMenuToggle={() => setMobileOpen(true)} />

        {/* Workspace views content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalAppShell;
