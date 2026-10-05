import React from 'react';
import { Switch } from '@/components/ui/Switch';

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border-main/50 last:border-b-0">
      <div className="flex flex-col text-left">
        <label className="text-sm font-bold text-text-primary tracking-tight leading-tight">
          {label}
        </label>
        <span className="text-xs text-text-secondary mt-1 leading-relaxed max-w-xl">
          {description}
        </span>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} className="shrink-0" />
    </div>
  );
};
