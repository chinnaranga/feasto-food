import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', disabled, id, ...props }, ref) => {
    const checkboxId = id || React.useId();

    return (
      <div className="flex flex-col gap-1 text-left font-sans">
        <div className="flex items-start gap-2.5">
          <div className="flex items-center h-5">
            <input
              id={checkboxId}
              ref={ref}
              type="checkbox"
              disabled={disabled}
              className={`h-4 w-4 rounded-none border border-[#141518] text-[#141518] accent-[#141518] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                ${error ? 'border-[#661527]' : ''} 
                ${className}`}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="text-xs select-none">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={`font-mono text-xs ${
                    disabled ? 'text-[#8A8D98] cursor-not-allowed' : 'text-[#141518] cursor-pointer'
                  }`}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-[11px] text-[#52555F] mt-0.5 leading-relaxed">{description}</p>
              )}
            </div>
          )}
        </div>
        {error && <span className="font-mono text-xs text-[#661527] font-bold">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
