import React from 'react';
import { Switch } from '@/components/ui/Switch';

interface SettingsToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const SettingsToggleRow: React.FC<SettingsToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-text-primary leading-tight tracking-tight">
          {label}
        </span>
        {description && (
          <span className="text-xs text-text-secondary mt-1 leading-relaxed max-w-xl">
            {description}
          </span>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} className="shrink-0" />
    </div>
  );
};
