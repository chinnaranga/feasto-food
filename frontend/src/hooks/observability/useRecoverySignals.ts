import { useCallback } from 'react';
import { useObservabilityStore } from '../../store/observability/observabilityStore';
import { useReleaseStore } from '../../store/release/releaseStore';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const useRecoverySignals = () => {
  const clearLogs = useObservabilityStore((state) => state.clearLogs);
  const triggerUpdateReload = useReleaseStore((state) => state.triggerUpdateReload);

  const resetApplication = useCallback(async () => {
    observabilityClient.captureSystemEvent(
      'security',
      'User initiated full application cache recovery reset.',
      'info'
    );

    try {
      // Clear Service Worker Caches
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }

      // Clear LocalStorage & SessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB databases
      if ('indexedDB' in window) {
        const dbs = await indexedDB.databases();
        dbs.forEach((db) => {
          if (db.name) indexedDB.deleteDatabase(db.name);
        });
      }

      // Reload
      window.location.reload();
    } catch (e) {
      // Fallback direct reload
      window.location.reload();
    }
  }, []);

  const recoverFromUpdate = useCallback(() => {
    observabilityClient.captureSystemEvent(
      'release',
      'User triggered version update reload recovery signal.',
      'info'
    );
    triggerUpdateReload();
  }, [triggerUpdateReload]);

  return {
    resetApplication,
    recoverFromUpdate,
    clearDiagnostics: clearLogs,
  };
};
export default useRecoverySignals;
