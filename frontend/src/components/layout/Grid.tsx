import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number | { default?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 'md',
  className = '',
  ...props
}) => {
  const gaps = {
    none: 'gap-0',
    xs: 'gap-2', // 8px
    sm: 'gap-4', // 16px
    md: 'gap-6', // 24px
    lg: 'gap-8', // 32px
    xl: 'gap-12', // 48px
    '2xl': 'gap-16', // 64px
  };

  // Resolve responsive grid columns
  const getColClass = () => {
    if (typeof cols === 'number') {
      const colMap: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
        12: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12',
      };
      return colMap[cols] || `grid-cols-${cols}`;
    }

    const { default: d = 1, sm, md, lg, xl } = cols;
    return [
      `grid-cols-${d}`,
      sm ? `sm:grid-cols-${sm}` : '',
      md ? `md:grid-cols-${md}` : '',
      lg ? `lg:grid-cols-${lg}` : '',
      xl ? `xl:grid-cols-${xl}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className={`grid ${getColClass()} ${gaps[gap]} ${className}`} {...props}>
      {children}
    </div>
  );
};
