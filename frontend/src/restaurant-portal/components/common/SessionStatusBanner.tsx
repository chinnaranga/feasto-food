import React from 'react';
import { AlertCircle } from 'lucide-react';
import { usePortalAuthStore } from '../../store/portalAuthStore';

export const SessionStatusBanner: React.FC = () => {
  const { user } = usePortalAuthStore();

  // Simulated banner trigger
  const showBanner = user && user.role === 'Staff';

  if (!showBanner) return null;

  return (
    <div
      className="bg-amber-50 border-b border-amber-200/80 px-6 py-2 flex items-center justify-between text-xs text-amber-700 text-left select-none z-[100]"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <AlertCircle size={13} className="shrink-0 text-amber-600 animate-pulse" />
        <span>
          <strong>Staff Mode active:</strong> Certain catalog settings and team invite menus are locked under your active workspace context.
        </span>
      </div>
    </div>
  );
};
export default SessionStatusBanner;
