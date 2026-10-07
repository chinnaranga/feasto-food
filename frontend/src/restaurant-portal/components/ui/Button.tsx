import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'acid' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all duration-150 select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#141518] hover:bg-[#252830] text-white border border-[#141518] shadow-[2px_2px_0px_rgba(20,21,24,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    secondary:
      'bg-[#FAF8F5] hover:bg-[#EBE7DD] text-[#141518] border border-[#141518]/25 shadow-none',
    outline:
      'bg-white hover:bg-[#FAF8F5] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    danger:
      'bg-[#991B1B] hover:bg-[#7f1d1d] text-white border border-[#991B1B] shadow-[2px_2px_0px_#141518]',
    ghost: 'bg-transparent hover:bg-[#141518]/5 text-[#141518] border border-transparent',
    acid:
      'bg-[#D7F04A] hover:bg-[#c2dc3a] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    accent:
      'bg-[#1B3BFF] hover:bg-[#1532db] text-white border border-[#1B3BFF] shadow-[2px_2px_0px_#141518] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-2.5 text-xs',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          PROCESSING...
        </>
      ) : (
        children
      )}
    </button>
  );
};
export default Button;

