import { useEffect } from 'react';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const useErrorTelemetry = () => {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Avoid circular infinite loops by ignoring errors coming from telemetry itself
      if (event.filename && event.filename.includes('observability')) {
        return;
      }
      observabilityClient.captureError(
        event.error || event.message,
        'component',
        { severity: 'error' }
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      observabilityClient.captureError(
        event.reason,
        'network',
        { severity: 'error' }
      );
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};
export default useErrorTelemetry;
