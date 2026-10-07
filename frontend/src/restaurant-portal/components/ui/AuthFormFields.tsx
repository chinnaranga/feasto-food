import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ─── FormError ───────────────────────────────────────────────────────────────
interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <span className="text-[10px] font-mono font-bold text-red-600 mt-1 block text-left" role="alert">
      ⚠ {message}
    </span>
  );
};

// ─── FormHint ────────────────────────────────────────────────────────────────
interface FormHintProps {
  message: string;
}

export const FormHint: React.FC<FormHintProps> = ({ message }) => {
  return (
    <p className="text-[9px] font-mono text-[#8A8D98] mt-1 block text-left">
      {message}
    </p>
  );
};

// ─── FormField ───────────────────────────────────────────────────────────────
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        <label htmlFor={id} className="text-[10px] font-mono font-bold text-[#141518] uppercase tracking-wider">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2.5 bg-white border ${
            error
              ? 'border-red-600 focus:ring-1 focus:ring-red-600'
              : 'border-[#141518]/20 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
          } focus:outline-none text-xs font-medium text-[#141518] transition-all duration-150 placeholder:text-[#8A8D98] ${className}`}
          {...props}
        />
        {hint && <FormHint message={hint} />}
        {error && <FormError message={error} />}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// ─── PasswordField ───────────────────────────────────────────────────────────
interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1 w-full text-left relative">
        <label htmlFor={id} className="text-[10px] font-mono font-bold text-[#141518] uppercase tracking-wider">
          {label}
        </label>
        <div className="relative w-full">
          <input
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-3 pr-9 py-2.5 bg-white border ${
              error
                ? 'border-red-600 focus:ring-1 focus:ring-red-600'
                : 'border-[#141518]/20 focus:border-[#141518] focus:ring-1 focus:ring-[#141518]'
            } focus:outline-none text-xs font-medium text-[#141518] transition-all duration-150 placeholder:text-[#8A8D98] ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#8A8D98] hover:text-[#141518] transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {hint && <FormHint message={hint} />}
        {error && <FormError message={error} />}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

// ─── CheckboxField ───────────────────────────────────────────────────────────
interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full text-left">
        <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-[#52555F] cursor-pointer select-none">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={`w-4 h-4 border-[#141518]/30 text-[#141518] accent-[#141518] focus:ring-1 focus:ring-[#141518] focus:outline-none ${className}`}
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <FormError message={error} />}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

// ─── RoleBadge ───────────────────────────────────────────────────────────────
interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 border border-[#141518] bg-[#FAF8F5] text-[#141518] text-[9px] font-mono font-bold uppercase tracking-wider">
      {role}
    </span>
  );
};

