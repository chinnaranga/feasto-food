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
  const baseStyle = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e35205]/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    outline: 'bg-white hover:bg-neutral-50 text-neutral-500 border border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-500',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600',
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
