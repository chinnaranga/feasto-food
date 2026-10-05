import { useRef, useCallback } from 'react';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const usePerformanceTelemetry = () => {
  const timers = useRef<Record<string, number>>({});

  const startMetric = useCallback((name: string) => {
    timers.current[name] = window.performance ? performance.now() : Date.now();
  }, []);

  const endMetric = useCallback((name: string, category: any = 'component') => {
    const startTime = timers.current[name];
    if (!startTime) return;

    const endTime = window.performance ? performance.now() : Date.now();
    const duration = parseFloat((endTime - startTime).toFixed(2));
    
    observabilityClient.capturePerformance(name, duration, category);
    delete timers.current[name];
  }, []);

  return { startMetric, endMetric };
};
export default usePerformanceTelemetry;
