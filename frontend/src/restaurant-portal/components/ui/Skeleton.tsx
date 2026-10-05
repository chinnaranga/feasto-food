import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const variants = {
    text: 'h-3 w-3/4 rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div className={`animate-pulse bg-neutral-200/60 ${variants[variant]} ${className}`} />
  );
};
export default Skeleton;
