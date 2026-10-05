import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, helperText, className = '', disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left font-sans">
        {label && (
          <label htmlFor={inputId} className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={`w-full py-2.5 pl-3.5 pr-10 bg-white text-sm text-[#141518] placeholder:text-[#8A8D98] border transition-colors disabled:opacity-50 disabled:bg-[#EBE7DD] outline-none font-sans
              ${
                error
                  ? 'border-[#661527] focus:border-[#661527] focus:ring-1 focus:ring-[#661527]'
                  : 'border-[#141518]/30 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
              } 
              ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-1 text-[#52555F] hover:text-[#141518] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <span className="font-mono text-xs text-[#661527] font-bold">{error}</span>}
        {!error && helperText && <span className="font-mono text-[10px] text-[#52555F]">{helperText}</span>}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
