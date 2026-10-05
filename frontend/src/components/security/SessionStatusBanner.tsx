import React from 'react';
import { useIdleWarning } from '../../hooks/security/useIdleWarning';
import { Button } from '../ui/Button';
import { ShieldAlert } from 'lucide-react';

export const SessionStatusBanner: React.FC = () => {
  const { isIdleWarningOpen, secondsRemaining, keepSessionAlive } = useIdleWarning();
  if (!isIdleWarningOpen) return null;

  return (
    <div className="bg-amber-500 text-white px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-header animate-slide-down text-xs select-none shadow-md">
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} className="animate-pulse" />
        <span className="font-semibold">
          Idle Session Inactivity: You will be signed out in <span className="font-extrabold font-mono">{secondsRemaining}s</span>.
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={keepSessionAlive}
          className="bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white text-[10px] font-bold h-7 py-1 px-3 rounded-lg"
        >
          Keep Session Alive
        </Button>
      </div>
    </div>
  );
};
export default SessionStatusBanner;
