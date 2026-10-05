import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary-bg text-center">
      {/* Spinner component */}
      <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin mb-6" />
      <div className="text-xs font-bold tracking-wider text-text-secondary uppercase font-heading animate-pulse">
        Mapping Flavors...
      </div>
    </div>
  );
};
