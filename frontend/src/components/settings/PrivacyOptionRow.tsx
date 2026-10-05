import React from 'react';

interface PrivacyOptionRowProps {
  label: string;
  description: string;
  control: React.ReactNode;
}

export const PrivacyOptionRow: React.FC<PrivacyOptionRowProps> = ({
  label,
  description,
  control,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border-main/50 last:border-b-0 text-left">
      <div className="flex flex-col flex-1">
        <span className="text-sm font-bold text-text-primary leading-tight tracking-tight">
          {label}
        </span>
        <span className="text-xs text-text-secondary mt-1 leading-relaxed max-w-xl">
          {description}
        </span>
      </div>
      <div className="shrink-0">
        {control}
      </div>
    </div>
  );
};
