import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className = '', disabled, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full py-2.5 pl-3.5 pr-10 rounded-lg border bg-white text-sm text-text-primary transition-all duration-150 disabled:opacity-50 disabled:bg-neutral-50 appearance-none cursor-pointer outline-none
              ${error 
                ? 'border-error-main focus:ring-2 focus:ring-error-main/20 focus:border-error-main' 
                : 'border-border-main focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange'
              } 
              ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 text-text-muted flex items-center pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <span className="text-xs text-error-main font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
