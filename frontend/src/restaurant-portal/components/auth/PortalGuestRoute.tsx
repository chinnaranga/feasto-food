import React, { Suspense } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import PortalLoader from '../common/PortalLoader';

export const PortalGuestRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isInitializing } = usePortalAuthStore();

  if (isInitializing) {
    return <PortalLoader />;
  }

  if (isAuthenticated) {
    // If redirect path is stored in location state, send user there, else to dashboard
    const state = location.state as { from?: string } | null;
    return <Navigate to={state?.from || '/restaurant-portal/dashboard'} replace />;
  }

  return (
    <Suspense fallback={<PortalLoader />}>
      <Outlet />
    </Suspense>
  );
};
export default PortalGuestRoute;
