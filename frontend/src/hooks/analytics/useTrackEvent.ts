import { useCallback } from 'react';
import { analytics } from '@/services/analytics';
import type { EventName } from '@/services/analytics/eventNames';
import type { EventPayloadMap } from '@/services/analytics/eventSchema';

/**
 * Reusable hook to track generic actions in a type-safe manner.
 */
export function useTrackEvent() {
  const trackEvent = useCallback(
    <T extends EventName>(
      eventName: T,
      payload: EventPayloadMap[T],
      pageName?: string
    ) => {
      analytics.trackEvent(eventName, payload, pageName);
    },
    []
  );

  return trackEvent;
}

export default useTrackEvent;
