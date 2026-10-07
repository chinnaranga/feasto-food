import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-[#141518]/20 p-5 sm:p-6 transition-all text-left ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
