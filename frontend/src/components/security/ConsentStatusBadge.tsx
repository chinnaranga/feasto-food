import React from 'react';
import { Lock, Check, Minus } from 'lucide-react';

interface ConsentStatusBadgeProps {
  isAlwaysActive?: boolean;
  isActive: boolean;
  className?: string;
}

export const ConsentStatusBadge: React.FC<ConsentStatusBadgeProps> = ({
  isAlwaysActive = false,
  isActive,
  className = '',
}) => {
  if (isAlwaysActive) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs select-none ${className}`}
      >
        <Lock size={11} className="text-neutral-500 shrink-0" aria-hidden="true" />
        <span>Always Active</span>
      </span>
    );
  }

  if (isActive) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs select-none ${className}`}
      >
        <Check size={11} className="text-emerald-600 stroke-[3] shrink-0" aria-hidden="true" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200/70 select-none ${className}`}
    >
      <Minus size={11} className="text-neutral-400 shrink-0" aria-hidden="true" />
      <span>Inactive</span>
    </span>
  );
};

export default ConsentStatusBadge;
