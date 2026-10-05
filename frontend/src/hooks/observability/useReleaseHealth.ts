import { useEffect } from 'react';
import { usePwaStore } from '../../store/pwa/pwaStore';
import { useReleaseStore } from '../../store/release/releaseStore';
import { observabilityClient } from '../../services/observability/observabilityClient';

export const useReleaseHealth = () => {
  const isUpdateAvailable = usePwaStore((state) => state.isUpdateAvailable);
  const versionMismatch = useReleaseStore((state) => state.versionMismatch);
  const version = useReleaseStore((state) => state.metadata.version);

  useEffect(() => {
    if (isUpdateAvailable) {
      observabilityClient.captureSystemEvent(
        'release',
        `A new build update is available for v${version}`,
        'info'
      );
    }
  }, [isUpdateAvailable, version]);

  useEffect(() => {
    if (versionMismatch) {
      observabilityClient.captureSystemEvent(
        'release',
        `Version mismatch detected: client running outdated version.`,
        'warn'
      );
    }
  }, [versionMismatch]);
};
export default useReleaseHealth;
