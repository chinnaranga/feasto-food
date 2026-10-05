import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  clean = false,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'max-w-md',
    sm: 'max-w-xl',
    md: 'max-w-3xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={`w-full mx-auto ${clean ? '' : 'px-4 sm:px-6 lg:px-8'} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
