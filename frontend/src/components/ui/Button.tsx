import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none';

    const variants = {
      primary: 'bg-[#141518] text-[#F3F0E8] hover:bg-[#1B3BFF] active:bg-[#1228b3]',
      secondary: 'bg-transparent text-[#141518] border border-[#141518] hover:bg-[#141518] hover:text-[#F3F0E8]',
      outline: 'bg-transparent text-[#141518] border border-[#141518]/30 hover:border-[#141518]',
      ghost: 'bg-transparent text-[#141518] hover:bg-[#141518]/5',
      text: 'bg-transparent text-[#1B3BFF] hover:underline p-0 lowercase',
      danger: 'bg-[#661527] text-white hover:bg-[#851e36]',
      success: 'bg-[#D7F04A] text-[#141518] hover:bg-[#c7df3d]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[11px] gap-1.5',
      md: 'px-4 py-2.5 text-xs gap-2',
      lg: 'px-6 py-3.5 text-sm gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.99 }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${variant === 'text' ? '' : sizes[size]} ${className}`}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin h-3.5 w-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
