import { usePwaStore } from '../../store/pwa/pwaStore';

export const useServiceWorkerUpdate = () => {
  const isUpdateAvailable = usePwaStore((state) => state.isUpdateAvailable);
  const applyUpdate = usePwaStore((state) => state.applyUpdate);
  const checkForUpdates = usePwaStore((state) => state.checkForUpdates);

  return {
    isUpdateAvailable,
    applyUpdate,
    checkForUpdates,
  };
};
