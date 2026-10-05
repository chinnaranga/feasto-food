import React from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[220px] bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
      <div className="p-3 bg-amber-100 rounded-full text-amber-600">
        <WifiOff className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-neutral-900">You are offline</h4>
        <p className="text-xs text-neutral-600 max-w-xs">
          Please check your internet connection to access real-time delivery information.
        </p>
      </div>
    </div>
  );
};
