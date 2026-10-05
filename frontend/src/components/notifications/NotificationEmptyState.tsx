import React from 'react';
import { BellOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NotificationEmptyStateProps {
  filter: string;
  onClearFilter?: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  filter,
  onClearFilter,
}) => {
  const isFiltered = filter !== 'all';

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-primary-bg rounded-3xl border border-border-main shadow-soft">
      <div className="w-14 h-14 bg-secondary-bg text-text-muted rounded-full flex items-center justify-center mb-4">
        <BellOff size={24} />
      </div>
      <h3 className="font-extrabold text-base text-text-primary mb-1.5 font-heading tracking-tight">
        {isFiltered ? 'No matching notifications' : 'All caught up!'}
      </h3>
      <p className="text-xs text-text-secondary max-w-sm leading-relaxed mb-6">
        {isFiltered
          ? `You don't have any notifications under the "${filter.replace('_', ' ')}" category at the moment.`
          : 'You have cleared or read all notifications. We will notify you when something important comes up!'}
      </p>
      {isFiltered && onClearFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilter}
          className="rounded-xl text-xs font-bold px-5 border border-border-main hover:bg-secondary-bg"
        >
          View all notifications
        </Button>
      )}
    </div>
  );
};
