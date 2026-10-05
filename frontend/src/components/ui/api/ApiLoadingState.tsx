import React from 'react';
import { Loader2 } from 'lucide-react';

interface ApiLoadingStateProps {
  message?: string;
}

export const ApiLoadingState: React.FC<ApiLoadingStateProps> = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px]">
      <Loader2 className="w-8 h-8 text-[#e35205] animate-spin" />
      <p className="text-sm font-medium text-neutral-600">{message}</p>
    </div>
  );
};
