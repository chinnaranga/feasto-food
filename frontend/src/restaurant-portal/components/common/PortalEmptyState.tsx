import React from 'react';
import { Inbox } from 'lucide-react';
import Button from '../ui/Button';

interface PortalEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const PortalEmptyState: React.FC<PortalEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 bg-neutral-50/50 rounded-2xl max-w-lg mx-auto my-12">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4 shrink-0">
        <Inbox size={20} />
      </div>
      
      <h3 className="text-xs font-black text-neutral-800 tracking-tight mb-1">{title}</h3>
      <p className="text-[11px] text-neutral-500 max-w-sm mb-5 leading-normal">{description}</p>
      
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default PortalEmptyState;
