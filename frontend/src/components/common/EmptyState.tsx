import React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 ${className}`}>
      {icon && <div className="mb-3 text-text-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-text-primary mb-1.5 font-heading tracking-tight">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
