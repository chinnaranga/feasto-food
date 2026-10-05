import { useObservabilityStore } from '../../store/observability/observabilityStore';
import { createDiagnosticEvent } from './diagnosticSchema';
import { EventCategory, SeverityLevel } from '../../types/observability';
import { redactSensitiveFields } from './redaction';

export const observabilityClient = {
  captureError: (
    error: Error | string | unknown,
    category: EventCategory = 'component',
    options?: {
      severity?: SeverityLevel;
      failedRequestType?: string;
      recoveryState?: { recoveryTriggered: boolean; recoveryAction: string };
    }
  ) => {
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { name: 'UnknownError', message: String(error) };

    // Sanitization: Redact sensitive information inside error messages/stacks
    const redactedDetails = redactSensitiveFields(errorDetails);

    const severity = options?.severity || 'error';
    const message = redactedDetails.message || 'An unexpected error occurred';

    const event = createDiagnosticEvent(category, severity, message, {
      errorDetails: redactedDetails,
      failedRequestType: options?.failedRequestType,
      recoveryState: options?.recoveryState,
    });

    useObservabilityStore.getState().addEvent(event);
  },

  capturePerformance: (
    metricName: string,
    durationMs: number,
    category: EventCategory = 'component'
  ) => {
    const severity = durationMs > 1000 ? 'warn' : 'info';
    const message = `Performance metric: ${metricName} completed in ${durationMs}ms`;

    const event = createDiagnosticEvent(category, severity, message);
    useObservabilityStore.getState().addEvent(event);
  },

  captureInteraction: (
    actionName: string,
    durationMs?: number,
    error?: Error | string | unknown
  ) => {
    // Record action stack trace helper
    useObservabilityStore.getState().addAction(actionName);

    if (error) {
      observabilityClient.captureError(error, 'interaction', { severity: 'warn' });
    } else if (durationMs && durationMs > 800) {
      const event = createDiagnosticEvent(
        'interaction',
        'info',
        `Interaction ${actionName} was slow: ${durationMs}ms`
      );
      useObservabilityStore.getState().addEvent(event);
    }
  },

  captureSystemEvent: (
    category: EventCategory,
    message: string,
    severity: SeverityLevel = 'info'
  ) => {
    const event = createDiagnosticEvent(category, severity, message);
    useObservabilityStore.getState().addEvent(event);
  },
};

export default observabilityClient;
