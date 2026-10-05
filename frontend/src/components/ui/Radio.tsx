import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', disabled, id, ...props }, ref) => {
    const radioId = id || React.useId();

    return (
      <div className="flex items-start gap-3 text-left">
        <div className="flex items-center h-5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            disabled={disabled}
            className={`h-4.5 w-4.5 rounded-full border border-border-main text-brand-orange focus:ring-brand-orange bg-primary-bg transition-main cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="text-sm select-none">
            {label && (
              <label
                htmlFor={radioId}
                className={`font-medium ${
                  disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-primary cursor-pointer'
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
