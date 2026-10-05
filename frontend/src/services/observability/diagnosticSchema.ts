import { DiagnosticEvent, EventCategory, SeverityLevel } from '../../types/observability';
import { buildMetadata } from '../release/buildMetadata';
import { useAuthStore } from '../../store/authStore';
import { useI18nStore } from '../../store/i18n/i18nStore';

export const createDiagnosticEvent = (
  category: EventCategory,
  severity: SeverityLevel,
  message: string,
  extraDetails?: {
    errorDetails?: { name: string; message: string; stack?: string };
    failedRequestType?: string;
    recoveryState?: { recoveryTriggered: boolean; recoveryAction: string };
  }
): DiagnosticEvent => {
  const authState = useAuthStore.getState();
  const i18nState = useI18nStore.getState();

  const userContext = authState.user
    ? {
        uid: authState.user.uid,
        email: authState.user.email, // Safe email redaction will be processed recursively later if needed
      }
    : undefined;

  // Extract network information
  const connectionState = window.navigator;
  const connectionInfo = (connectionState as any).connection || 
                         (connectionState as any).mozConnection || 
                         (connectionState as any).webkitConnection;

  const connectionContext = {
    online: connectionState.onLine,
    type: connectionInfo?.type,
    effectiveType: connectionInfo?.effectiveType,
  };

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    category,
    severity,
    message,
    errorDetails: extraDetails?.errorDetails,
    context: {
      route: window.location.pathname,
      user: userContext,
      connection: connectionContext,
      locale: i18nState.language || 'en',
      releaseVersion: buildMetadata.version,
      releaseChannel: buildMetadata.buildChannel,
      failedRequestType: extraDetails?.failedRequestType,
    },
    recoveryState: extraDetails?.recoveryState,
  };
};
export default createDiagnosticEvent;
