import { useCallback } from 'react';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const useInteractionHealth = () => {
  const trackAction = useCallback((name: string, execute: () => void | Promise<void>) => {
    return async () => {
      const start = window.performance ? performance.now() : Date.now();
      try {
        await execute();
        const duration = parseFloat(((window.performance ? performance.now() : Date.now()) - start).toFixed(2));
        observabilityClient.captureInteraction(name, duration);
      } catch (error) {
        observabilityClient.captureInteraction(name, undefined, error);
        throw error;
      }
    };
  }, []);

  return { trackAction };
};
export default useInteractionHealth;
