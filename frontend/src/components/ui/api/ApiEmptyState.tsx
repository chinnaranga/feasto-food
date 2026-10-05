import React from 'react';
import { Inbox } from 'lucide-react';

interface ApiEmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ApiEmptyState: React.FC<ApiEmptyStateProps> = ({
  title = 'No data available',
  message = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[220px] bg-neutral-50/50 rounded-2xl border border-neutral-100 text-center">
      <div className="p-3 bg-neutral-100 rounded-full text-neutral-400">
        <Inbox className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-neutral-900">{title}</h4>
        <p className="text-xs text-neutral-500 max-w-sm">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-bold text-neutral-800 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
