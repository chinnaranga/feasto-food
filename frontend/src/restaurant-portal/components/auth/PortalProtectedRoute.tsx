import React, { Suspense } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { NAVIGATION_NODES } from '../../constants/portal';
import PortalLoader from '../common/PortalLoader';
import AccessDeniedCard from '../common/AccessDeniedCard';

export const PortalProtectedRoute: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, isInitializing } = usePortalAuthStore();

  if (isInitializing) {
    return <PortalLoader />;
  }

  // 1. Authenticated Guard
  if (!isAuthenticated) {
    // Redirect to login, preserving target path
    return <Navigate to="/restaurant-portal/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Verification Guard Placeholder (e.g. if email verification is required in future stages)
  // For R2, we assume a verified account by default.

  // 3. Role-Based Access Guard (RBAC)
  const userRole = user?.role || 'Staff';
  
  // Find matching navigation node requirements
  const matchedNode = NAVIGATION_NODES.find((node) => {
    // Exact path match or starting matching segment
    return node.path === location.pathname;
  });

  if (matchedNode && !matchedNode.roles.includes(userRole)) {
    return <AccessDeniedCard requiredPermission={matchedNode.label} />;
  }

  return (
    <Suspense fallback={<PortalLoader />}>
      <Outlet />
    </Suspense>
  );
};
export default PortalProtectedRoute;
