import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, error, helperText, onClear, value, onChange, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-text-primary tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-text-muted flex items-center pointer-events-none">
            <Search size={18} />
          </div>
          <input
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full py-2.5 pl-11 rounded-xl border bg-primary-bg text-sm text-text-primary transition-main focus-ring disabled:opacity-50 disabled:bg-[#f1f3f7]
              ${onClear && hasValue ? 'pr-10' : 'pr-4'} 
              ${error ? 'border-error-main focus-visible:outline-error-main' : 'border-border-main focus-visible:outline-brand-orange'} 
              ${className}`}
            {...props}
          />
          {onClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3.5 p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-bg transition-main cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {error && <span className="text-xs text-error-main font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
