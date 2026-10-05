import { usePwaStore } from '../../store/pwa/pwaStore';
import { NetworkQuality } from '../../types/pwa';

export const useOnlineStatus = (): {
  isOffline: boolean;
  networkQuality: NetworkQuality;
  isOnline: boolean;
} => {
  const isOffline = usePwaStore((state) => state.isOffline);
  const networkQuality = usePwaStore((state) => state.networkQuality);

  return {
    isOffline,
    networkQuality,
    isOnline: !isOffline,
  };
};
