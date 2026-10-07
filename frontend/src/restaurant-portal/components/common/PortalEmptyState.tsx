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
    <div className="flex flex-col items-center justify-center text-center p-10 border border-[#141518] bg-white max-w-lg mx-auto my-12 shadow-[4px_4px_0px_#141518]">
      <div className="w-12 h-12 bg-[#FAF8F5] border border-[#141518] flex items-center justify-center text-[#141518] mb-4 shrink-0">
        <Inbox size={22} />
      </div>

      <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8D98] block mb-1">
        [ZERO RECORDS ENCOUNTERED]
      </span>
      <h3 className="font-heading font-black text-base uppercase tracking-tight text-[#141518] mb-1.5">
        {title}
      </h3>
      <p className="font-sans text-xs text-[#52555F] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel} →
        </Button>
      )}
    </div>
  );
};
export default PortalEmptyState;
