import { usePwaStore } from '../../store/pwa/pwaStore';

export const useInstallPrompt = () => {
  const deferredPrompt = usePwaStore((state) => state.deferredPrompt);
  const showInstallPrompt = usePwaStore((state) => state.showInstallPrompt);
  const showInstallGuide = usePwaStore((state) => state.showInstallGuide);
  const triggerInstall = usePwaStore((state) => state.triggerInstall);
  const setShowInstallPrompt = usePwaStore((state) => state.setShowInstallPrompt);
  const setShowInstallGuide = usePwaStore((state) => state.setShowInstallGuide);

  const isInstallable = deferredPrompt !== null;

  return {
    isInstallable,
    showInstallPrompt,
    showInstallGuide,
    triggerInstall,
    setShowInstallPrompt,
    setShowInstallGuide,
  };
};
