import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { TopNavbar } from './TopNavbar';
import { useAdminStore } from '../../store/admin/adminStore';
import { useRouteHealth } from '@/hooks/observability/useRouteHealth';
import { RouteHealthIndicator } from '@/components/observability/RouteHealthIndicator';
import { AdminPermission } from '../../types/admin';
import { AccessDeniedCard } from '../security/AccessDeniedCard';

// Map sub-paths of /admin to their required permissions
const PATH_PERMISSION_MAP: Record<string, AdminPermission> = {
  dashboard: 'view_dashboard',
  restaurants: 'manage_restaurants',
  orders: 'manage_orders',
  users: 'manage_users',
  delivery: 'manage_delivery',
  support: 'manage_support',
  marketing: 'manage_marketing',
  analytics: 'view_analytics',
  content: 'manage_content',
  settings: 'manage_settings',
};

export const WorkspaceLayout: React.FC = () => {
  useRouteHealth();
  const location = useLocation();
  const { activePermissions, setActiveRole } = useAdminStore();

  // Determine required permission for the current sub-route
  const getRequiredPermission = (): AdminPermission | null => {
    const segments = location.pathname.split('/');
    const last = segments[segments.length - 1];
    return PATH_PERMISSION_MAP[last] || null;
  };

  const required = getRequiredPermission();
  const hasAccess = required ? activePermissions.includes(required) : true;

  return (
    <div className="flex bg-secondary-bg min-h-screen text-text-primary">
      <RouteHealthIndicator />
      {/* Sidebar Panel */}
      <AdminSidebar />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-8 text-left">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <RefreshCw size={24} className="animate-spin text-brand-orange" />
              </div>
            }
          >
            {hasAccess ? (
              <Outlet />
            ) : (
              <AccessDeniedCard
                requiredPermission={required || undefined}
                onBack={() => setActiveRole('super_admin')}
              />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
};
