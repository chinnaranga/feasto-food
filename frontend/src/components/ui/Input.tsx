import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && (
          <label htmlFor={inputId} className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[#52555F] flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full py-2.5 bg-white text-sm text-[#141518] placeholder:text-[#8A8D98] border transition-colors disabled:opacity-50 disabled:bg-[#EBE7DD] outline-none font-sans
              ${icon ? 'pl-11 pr-4' : 'px-3.5'} 
              ${error 
                ? 'border-[#661527] focus:border-[#661527] focus:ring-1 focus:ring-[#661527]' 
                : 'border-[#141518]/30 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
              } 
              ${className}`}
            {...props}
          />
        </div>
        {error && <span className="font-mono text-xs text-[#661527] font-bold">{error}</span>}
        {!error && helperText && <span className="font-mono text-[10px] text-[#52555F]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
