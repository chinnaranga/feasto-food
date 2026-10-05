import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ApiErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ApiErrorState: React.FC<ApiErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[220px] bg-red-50/50 rounded-2xl border border-red-100 text-center">
      <div className="p-3 bg-red-100 rounded-full text-red-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-neutral-900">{title}</h4>
        <p className="text-xs text-neutral-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#e35205] rounded-xl hover:bg-[#c84400] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
