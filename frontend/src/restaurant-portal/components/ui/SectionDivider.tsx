import React from 'react';

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ label, className = '' }) => {
  if (label) {
    return (
      <div className={`flex items-center gap-3 my-2 ${className}`}>
        <div className="flex-1 h-px bg-neutral-100" />
        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-neutral-100" />
      </div>
    );
  }

  return <div className={`h-px bg-neutral-100 my-2 ${className}`} />;
};

export default SectionDivider;
