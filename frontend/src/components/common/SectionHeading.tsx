import React from 'react';

export interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 ${className}`}>
      <div className="flex flex-col text-left">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary font-heading">{title}</h2>
        {description && <p className="text-sm text-text-muted mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
};
