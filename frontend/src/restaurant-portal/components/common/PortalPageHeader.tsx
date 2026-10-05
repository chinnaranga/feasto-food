import React from 'react';

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PortalPageHeader: React.FC<PortalPageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5 text-left mb-6">
      <div className="min-w-0">
        <h1 className="text-xl font-black font-heading tracking-tight text-neutral-900 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-neutral-500 mt-1 leading-normal max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};
export default PortalPageHeader;
