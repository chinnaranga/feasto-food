import type { BaseEventPayload } from '@/services/analytics/eventSchema';
import { useAuthStore } from '@/store/authStore';

export function getPageName(path: string): string {
  if (path === '/') return 'Landing Page';
  if (path === '/discover') return 'Discovery Hub';
  if (path === '/restaurants') return 'Restaurants List';
  if (path.startsWith('/restaurants/') && path.includes('/menu')) return 'Restaurant Menu';
  if (path.startsWith('/restaurants/')) return 'Restaurant Details';
  if (path === '/cart') return 'Shopping Cart';
  if (path === '/checkout') return 'Checkout Form';
  if (path === '/checkout/success') return 'Checkout Success';
  if (path === '/checkout/failure') return 'Checkout Failure';
  if (path === '/profile') return 'User Profile';
  if (path === '/orders') return 'Orders History';
  if (path.startsWith('/orders/') && path.includes('/track')) return 'Order Tracking';
  if (path.startsWith('/orders/')) return 'Order Details';
  if (path === '/notifications') return 'Notifications Center';
  if (path === '/settings') return 'User Settings';
  if (path === '/support') return 'Support FAQ';
  if (path === '/support/contact') return 'Contact Support';
  if (path === '/auth/signin') return 'Sign In';
  if (path === '/auth/signup') return 'Sign Up';
  if (path === '/auth/forgot-password') return 'Forgot Password';
  if (path === '/auth/verify-otp') return 'Verify OTP';
  if (path === '/auth/reset-password') return 'Reset Password';
  return 'Unknown Page';
}

// Get or generate a persistent anonymous session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  let session = sessionStorage.getItem('feasto_anonymous_session');
  if (!session) {
    session = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('feasto_anonymous_session', session);
  }
  return session;
}

// Helper to deduce device type based on window width
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Build standard event wrapper metadata
export function normalizeAnalyticsPayload(pageName: string | undefined, path: string): BaseEventPayload {
  const authState = useAuthStore.getState();
  const userId = authState.user?.uid;
  const userRole = authState.isAuthenticated ? 'user' : 'guest';
  const resolvedPage = pageName || getPageName(path);

  // Get UTM tags if any exist in current query params
  let utmSource: string | undefined;
  let utmCampaign: string | undefined;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    utmSource = params.get('utm_source') || undefined;
    utmCampaign = params.get('utm_campaign') || undefined;
  }

  return {
    timestamp: new Date().toISOString(),
    path,
    pageName: resolvedPage,
    userRole,
    userId,
    sessionId: getSessionId(),
    deviceType: getDeviceType(),
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    utmSource,
    utmCampaign,
  };
}

export default normalizeAnalyticsPayload;
