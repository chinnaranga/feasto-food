import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceTelemetry } from './usePerformanceTelemetry';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const useRouteHealth = () => {
  const location = useLocation();
  const { startMetric, endMetric } = usePerformanceTelemetry();

  useEffect(() => {
    // Record route navigation action in log stack
    observabilityClient.captureInteraction(`Navigate to ${location.pathname}`);
    
    // Measure route transition latency
    const metricName = `route-transition-${location.pathname}`;
    startMetric(metricName);

    // Conclude timing once page renders
    const timeout = setTimeout(() => {
      endMetric(metricName, 'route');
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [location.pathname, startMetric, endMetric]);
};
export default useRouteHealth;
