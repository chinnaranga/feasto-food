import { usePwaStore } from '../../store/pwa/pwaStore';
import { NetworkQuality } from '../../types/pwa';

export const initNetworkStatusListener = (): void => {
  if (typeof window === 'undefined') return;

  const updateOnlineStatus = () => {
    const isOffline = !navigator.onLine;
    usePwaStore.getState().setOffline(isOffline);
    if (isOffline) {
      usePwaStore.getState().setNetworkQuality('none');
    } else {
      checkNetworkQuality();
    }
  };

  const checkNetworkQuality = () => {
    // If Network Information API is available, check connection properties
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (conn) {
      const updateQuality = () => {
        let quality: NetworkQuality = 'good';
        if (navigator.onLine === false) {
          quality = 'none';
        } else if (conn.effectiveType === '2g' || conn.effectiveType === '3g') {
          quality = 'slow';
        }
        usePwaStore.getState().setNetworkQuality(quality);
      };

      conn.addEventListener('change', updateQuality);
      updateQuality();
      return;
    }

    // Fallback: If no API, assume 'good' when navigator.onLine is true
    usePwaStore.getState().setNetworkQuality(navigator.onLine ? 'good' : 'none');
  };

  // Bind online/offline window listeners
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial call to align store state
  updateOnlineStatus();
};
