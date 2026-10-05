import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ─── FormError ───────────────────────────────────────────────────────────────
interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <span className="text-[10px] font-bold text-red-600 mt-1 block text-left" role="alert">
      {message}
    </span>
  );
};

// ─── FormHint ────────────────────────────────────────────────────────────────
interface FormHintProps {
  message: string;
}

export const FormHint: React.FC<FormHintProps> = ({ message }) => {
  return (
    <p className="text-[9px] font-medium text-neutral-400 mt-1 block text-left">
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
        <label htmlFor={id} className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 bg-white border ${
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
          } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 transition-all duration-200 placeholder:text-neutral-400 ${className}`}
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
        <label htmlFor={id} className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          {label}
        </label>
        <div className="relative w-full">
          <input
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-3 pr-9 py-2 bg-white border ${
              error ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
            } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 transition-all duration-200 placeholder:text-neutral-400 ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-neutral-600 transition-main cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
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
        <label htmlFor={id} className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={`rounded border-neutral-300 text-[#e35205] focus:ring-[#e35205]/20 focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all duration-200 ${className}`}
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
  const configs: Record<string, string> = {
    Owner: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Manager: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Finance: 'bg-amber-50 text-amber-700 border-amber-100',
    Kitchen: 'bg-orange-50 text-orange-700 border-orange-100',
    Cashier: 'bg-sky-50 text-sky-700 border-sky-100',
    Staff: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  const style = configs[role] || configs.Staff;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${style}`}>
      {role}
    </span>
  );
};
