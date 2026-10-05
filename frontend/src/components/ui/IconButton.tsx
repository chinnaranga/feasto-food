import React from 'react';
import { motion } from 'framer-motion';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full transition-main cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-brand-orange text-white hover:bg-[#c94804] active:bg-[#a63c03]',
      secondary: 'bg-surface-bg text-text-primary hover:bg-[#eef1f6] active:bg-[#e2e6ee] border border-border-main',
      outline: 'bg-transparent text-text-primary hover:bg-surface-bg border border-border-main',
      ghost: 'bg-transparent text-text-secondary hover:bg-surface-bg hover:text-text-primary',
    };

    const sizes = {
      sm: 'w-8 h-8 p-1.5 text-xs',
      md: 'w-10 h-10 p-2 text-sm',
      lg: 'w-12 h-12 p-3 text-base',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled ? undefined : { scale: 0.96 }}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
