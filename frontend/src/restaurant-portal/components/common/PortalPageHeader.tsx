import React from 'react';

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  tag?: string;
}

export const PortalPageHeader: React.FC<PortalPageHeaderProps> = ({
  title,
  description,
  actions,
  tag = 'STUDIO STATION',
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141518]/15 pb-6 text-left mb-8">
      <div className="min-w-0 space-y-1">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8A8D98] block">
          [{tag}]
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight text-[#141518] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs font-sans text-[#52555F] leading-normal max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start md:self-end">
          {actions}
        </div>
      )}
    </div>
  );
};
export default PortalPageHeader;

