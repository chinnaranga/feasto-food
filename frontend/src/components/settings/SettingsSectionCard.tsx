import React from 'react';

interface SettingsSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSectionCard: React.FC<SettingsSectionCardProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-primary-bg border border-border-main rounded-3xl p-6 text-left shadow-soft ${className}`}>
      <div className="border-b border-border-main/50 pb-4 mb-5">
        <h2 className="text-base font-extrabold text-text-primary font-heading tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
};
