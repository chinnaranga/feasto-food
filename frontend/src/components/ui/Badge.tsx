import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', children, className = '' }) => {
  const variants = {
    primary: 'bg-[#6D5EF5]/15 text-[#A78BFA] border border-[#6D5EF5]/30',
    secondary: 'bg-white/5 text-[#A7ACB8] border border-white/10',
    success: 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30',
    warning: 'bg-amber-400/15 text-amber-300 border border-amber-400/30',
    error: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    info: 'bg-[#4FD1E8]/15 text-[#4FD1E8] border border-[#4FD1E8]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium select-none ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
