import React from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-start gap-3 text-left select-none ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={toggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-ring focus-visible:outline-2 focus-visible:outline-brand-orange disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-brand-orange' : 'bg-[#e2e8f0]'}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      {(label || description) && (
        <div className="text-sm">
          {label && (
            <span
              onClick={toggle}
              className={`font-medium ${
                disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-primary cursor-pointer'
              }`}
            >
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};
