import React from 'react';

/**
 * FEASTO ACTION
 * Graphic action buttons: Minimal, typographic, architectural, high-contrast.
 * Avoids generic SaaS rounded buttons with giant drop shadows.
 */

export type FeastoButtonVariant =
  | 'primary'
  | 'accent'
  | 'acid'
  | 'ghost'
  | 'danger'
  | 'outline';

interface FeastoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FeastoButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

export const FeastoButton: React.FC<FeastoButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconRight,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles: Record<FeastoButtonVariant, string> = {
    primary:
      'bg-[#141518] text-[#F3F0E8] border border-[#141518] hover:bg-[#D7F04A] hover:text-[#141518] hover:border-[#141518]',
    accent:
      'bg-[#1B3BFF] text-white border border-[#1B3BFF] hover:bg-[#1530d9]',
    acid:
      'bg-[#D7F04A] text-[#141518] border border-[#141518] hover:bg-[#c6df3d]',
    ghost:
      'bg-transparent text-[#141518] dark:text-[#F3F0E8] border border-[#141518]/20 dark:border-white/20 hover:bg-[#141518]/5 dark:hover:bg-white/5',
    outline:
      'bg-transparent text-current border border-current hover:bg-current/10',
    danger:
      'bg-[#991B1B] text-white border border-[#991B1B] hover:bg-[#7f1616]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[11px] font-mono gap-1.5',
    md: 'px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase gap-2',
    lg: 'px-6 py-3 text-sm font-heading font-bold tracking-wider uppercase gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center cursor-pointer select-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
