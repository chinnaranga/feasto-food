import { useCallback } from 'react';
import { useTrackEvent } from './useTrackEvent';
import { EventNames } from '@/services/analytics/eventNames';

/**
 * Hook to track user progress through conversion, authentication, or search funnels.
 */
export function useTrackFunnel() {
  const trackEvent = useTrackEvent();

  const trackFunnelStep = useCallback(
    (
      funnelName: 'conversion' | 'auth' | 'search',
      stepIndex: number,
      stepName: string,
      metadata?: Record<string, any>
    ) => {
      trackEvent(
        EventNames.FUNNEL_STEP,
        {
          funnelName,
          stepIndex,
          stepName,
          metadata,
        },
        `Funnel: ${funnelName}`
      );
    },
    [trackEvent]
  );

  return trackFunnelStep;
}
export default useTrackFunnel;
