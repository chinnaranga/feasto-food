import React from 'react';

export interface DashboardCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  action,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-primary-bg border border-border-main rounded-2xl p-6 shadow-xs flex flex-col text-left ${className}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary tracking-tight font-heading">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Card Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
