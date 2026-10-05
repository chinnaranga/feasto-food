import { DiagnosticEvent } from '../../types/observability';

export const normalizeDiagnosticEvent = (event: DiagnosticEvent): string => {
  const msg = event.message.toLowerCase();

  if (event.category === 'network') {
    if (msg.includes('failed to fetch') || msg.includes('network error') || msg.includes('408')) {
      return 'Internet connection lost. Feasto is running offline.';
    }
  }

  if (event.category === 'security') {
    if (msg.includes('insufficient permissions') || msg.includes('restricted') || msg.includes('permission-denied')) {
      return 'Account permissions modified. Live sync paused, using persistence memory cache.';
    }
  }

  if (event.category === 'pwa' || event.category === 'release') {
    if (msg.includes('mismatch') || msg.includes('new version')) {
      return 'A newer version of Feasto is available. Reloading is recommended.';
    }
  }

  if (event.severity === 'fatal') {
    return 'An unexpected issue occurred. Feasto is restoring your session.';
  }

  return event.message;
};
export default normalizeDiagnosticEvent;
