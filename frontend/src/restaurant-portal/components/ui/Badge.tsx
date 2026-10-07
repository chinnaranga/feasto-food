import React from 'react';

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'acid';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', children, className = '' }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-50 text-amber-900 border-amber-300',
    danger: 'bg-red-50 text-red-900 border-red-300',
    info: 'bg-blue-50 text-[#1B3BFF] border-blue-200',
    secondary: 'bg-[#FAF8F5] text-[#141518] border-[#141518]/25',
    acid: 'bg-[#D7F04A] text-[#141518] border-[#141518]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border font-mono text-[9px] font-bold uppercase tracking-wider select-none ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
export default Badge;
