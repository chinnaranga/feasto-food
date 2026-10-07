import React from 'react';

export const PortalLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-60 font-mono">
      <div className="animate-spin h-8 w-8 border-2 border-[#141518] border-t-[#D7F04A]" />
      <span className="text-[10px] font-bold text-[#52555F] mt-4 tracking-widest uppercase">
        [INITIALIZING STUDIO TERMINAL...]
      </span>
    </div>
  );
};

export default PortalLoader;
