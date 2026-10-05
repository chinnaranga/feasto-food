import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-border-main p-6 shadow-soft transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-medium hover:border-neutral-300 hover:scale-[1.01] active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
