import React from 'react';

interface PreferenceGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const PreferenceGroup: React.FC<PreferenceGroupProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl p-5 sm:p-6 text-left shadow-soft">
      <div className="border-b border-border-main/50 pb-4 mb-4">
        <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
};
