import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-neutral-200/80 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
