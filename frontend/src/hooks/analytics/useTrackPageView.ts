import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

/**
 * Hook to automatically track Page Views.
 * Listens to location changes in the router and fires page_view event with the resolved pageName descriptor.
 */
export function useTrackPageView(pageName: string) {
  const location = useLocation();

  useEffect(() => {
    const fullPath = location.pathname + location.search;
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined;
    analytics.trackPageView(fullPath, pageName, referrer);
  }, [location.pathname, location.search, pageName]);
}

/**
 * Centered route layout page view tracker hook.
 * Maps paths to clean event labels and fires page_view analytics on transitions.
 */
export function useTrackRoutePageView() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageName = 'Unknown Page';

    if (path === '/') pageName = 'Landing Page';
    else if (path === '/discover') pageName = 'Discovery Hub';
    else if (path === '/restaurants') pageName = 'Restaurants List';
    else if (path.startsWith('/restaurants/') && path.includes('/menu')) pageName = 'Restaurant Menu';
    else if (path.startsWith('/restaurants/')) pageName = 'Restaurant Details';
    else if (path === '/cart') pageName = 'Shopping Cart';
    else if (path === '/checkout') pageName = 'Checkout Form';
    else if (path === '/checkout/success') pageName = 'Checkout Success';
    else if (path === '/checkout/failure') pageName = 'Checkout Failure';
    else if (path === '/profile') pageName = 'User Profile';
    else if (path === '/orders') pageName = 'Orders History';
    else if (path.startsWith('/orders/') && path.includes('/track')) pageName = 'Order Tracking';
    else if (path.startsWith('/orders/')) pageName = 'Order Details';
    else if (path === '/notifications') pageName = 'Notifications Center';
    else if (path === '/settings') pageName = 'User Settings';
    else if (path === '/support') pageName = 'Support FAQ';
    else if (path === '/support/contact') pageName = 'Contact Support';
    else if (path === '/auth/signin') pageName = 'Sign In';
    else if (path === '/auth/signup') pageName = 'Sign Up';
    else if (path === '/auth/forgot-password') pageName = 'Forgot Password';
    else if (path === '/auth/verify-otp') pageName = 'Verify OTP';
    else if (path === '/auth/reset-password') pageName = 'Reset Password';

    const fullPath = path + location.search;
    const referrer = typeof document !== 'undefined' ? document.referrer : undefined;
    analytics.trackPageView(fullPath, pageName, referrer);
  }, [location.pathname, location.search]);
}

export default useTrackPageView;
