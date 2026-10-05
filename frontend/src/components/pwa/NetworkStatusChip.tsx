import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/pwa/useOnlineStatus';

export interface NetworkStatusChipProps {
  showOptimalState?: boolean;
  className?: string;
}

export const NetworkStatusChip: React.FC<NetworkStatusChipProps> = ({
  showOptimalState = false,
  className = '',
}) => {
  const { isOffline, networkQuality } = useOnlineStatus();

  if (isOffline) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-error-main/10 border border-error-main/20 text-error-main shadow-xs select-none ${className}`}>
        <WifiOff size={11} className="animate-pulse" />
        <span>Offline</span>
      </div>
    );
  }

  if (networkQuality === 'slow') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-xs select-none ${className}`}>
        <Wifi size={11} className="animate-pulse" />
        <span>Slow Net</span>
      </div>
    );
  }

  if (showOptimalState) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-success-main/10 border border-success-main/20 text-success-main select-none ${className}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-success-main" />
        <span>Online</span>
      </div>
    );
  }

  return null;
};
