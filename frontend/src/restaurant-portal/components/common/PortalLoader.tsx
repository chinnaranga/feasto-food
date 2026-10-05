import React from 'react';

export const PortalLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-60">
      <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#e35205] border-t-transparent" />
      <span className="text-[10px] font-bold text-neutral-400 mt-4 tracking-wider uppercase">
        Loading operations desk...
      </span>
    </div>
  );
};
export default PortalLoader;
