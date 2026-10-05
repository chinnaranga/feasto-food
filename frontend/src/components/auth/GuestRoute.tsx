import React, { useEffect, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/pages/Loading';
import { useRouteHealth } from '@/hooks/observability/useRouteHealth';

export const GuestRoute: React.FC = () => {
  useRouteHealth();
  const { isAuthenticated, redirectPath, setRedirectPath } = useAuthStore();

  // Clear the redirect path AFTER render — never during render.
  useEffect(() => {
    if (isAuthenticated && redirectPath) {
      setRedirectPath(null);
    }
  }, [isAuthenticated, redirectPath, setRedirectPath]);

  if (isAuthenticated) {
    return <Navigate to={redirectPath || '/'} replace />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};
