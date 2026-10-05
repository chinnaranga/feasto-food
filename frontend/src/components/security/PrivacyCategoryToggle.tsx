import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface PrivacyCategoryToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}

export const PrivacyCategoryToggle: React.FC<PrivacyCategoryToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  className = '',
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed
          ${
            disabled
              ? 'bg-neutral-200 opacity-90'
              : checked
                ? 'bg-brand-orange shadow-xs'
                : 'bg-neutral-200 hover:bg-neutral-300'
          }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`pointer-events-none flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        >
          {disabled && <Lock size={10} className="text-neutral-400" aria-hidden="true" />}
        </motion.span>
      </button>
    </div>
  );
};

export default PrivacyCategoryToggle;
