import React from 'react';

export interface PageSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  background?: 'default' | 'secondary' | 'surface';
}

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  background = 'default',
  className = '',
  ...props
}) => {
  const backgrounds = {
    default: 'bg-primary-bg',
    secondary: 'bg-secondary-bg',
    surface: 'bg-surface-bg',
  };

  return (
    <section
      className={`py-12 md:py-16 lg:py-20 ${backgrounds[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};
