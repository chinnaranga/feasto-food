import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md';
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    outline:
      'bg-white hover:bg-[#FAF8F5] text-[#141518] border border-[#141518]/25 shadow-[1px_1px_0px_#141518] active:translate-x-[1px] active:translate-y-[1px]',
    ghost: 'bg-transparent hover:bg-[#141518]/5 text-[#141518]',
    secondary: 'bg-[#FAF8F5] hover:bg-[#EBE7DD] text-[#141518] border border-[#141518]/15',
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default IconButton;
