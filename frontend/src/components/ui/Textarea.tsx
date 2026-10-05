import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', disabled, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm text-text-primary placeholder:text-neutral-400 transition-all duration-150 disabled:opacity-50 disabled:bg-neutral-50 resize-y min-h-[100px] outline-none
            ${error 
              ? 'border-error-main focus:ring-2 focus:ring-error-main/20 focus:border-error-main' 
              : 'border-border-main focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange'
            } 
            ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-error-main font-medium">{error}</span>}
        {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
