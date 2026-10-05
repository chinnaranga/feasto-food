import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/pages/Loading';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitializing, setRedirectPath } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      setRedirectPath(location.pathname + location.search);
    }
  }, [isInitializing, isAuthenticated, location.pathname, location.search, setRedirectPath]);

  // While confirming session, display calm loading state
  if (isInitializing) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/signin?returnTo=${returnUrl}`} replace />;
  }

  return <Outlet />;
};
