import type { EventName } from './eventNames';
import type { EventPayloadMap } from './eventSchema';
import { isTrackingAllowed } from '@/utils/analytics/analyticsGuard';
import { normalizeAnalyticsPayload } from '@/utils/analytics/normalizePayload';

class AnalyticsClient {
  private isDev = import.meta.env.DEV;

  /**
   * Primary method to dispatch compile-safe events.
   * Checks for user privacy options and routes logs dynamically.
   */
  public trackEvent<T extends EventName>(
    eventName: T,
    payload: EventPayloadMap[T],
    pageName?: string
  ): void {
    // 1. Enforce privacy controls
    if (!isTrackingAllowed()) {
      if (this.isDev) {
        console.info(
          '%c[Analytics] Event suppressed due to user privacy settings:',
          'color: #94a3b8; font-style: italic',
          eventName
        );
      }
      return;
    }

    // 2. Normalize metadata context
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const metadata = normalizeAnalyticsPayload(pageName, currentPath);
    const fullPayload = {
      event: eventName,
      metadata,
      properties: payload,
    };

    // 3. Environment-specific routing
    if (this.isDev) {
      // Premium styled logs for development debugging
      console.log(
        `%c⚡ [Analytics] Event: ${eventName}`,
        'color: #e35205; font-weight: 800; background: #e35205/5; padding: 2px 6px; border-radius: 4px;',
        fullPayload
      );
    } else {
      // Production path: send telemetry or log quiet trace
      // Placeholder for backend webhook telemetry endpoint dispatch
      this.sendTelemetry(fullPayload);
    }
  }

  /**
   * Dedicated shortcut to dispatch page view events.
   */
  public trackPageView(_path: string, pageName: string, referrer?: string): void {
    this.trackEvent(
      'page_view',
      { referrer },
      pageName
    );
  }

  /**
   * Dummy simulation of telemetry POST request to analytics collector API
   */
  private sendTelemetry(_payload: Record<string, any>): void {
    // In a real production deployment, this would use fetch or an apiClient:
    // fetch('/api/telemetry/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // }).catch(() => {});
  }
}

export const analytics = new AnalyticsClient();
export default analytics;
