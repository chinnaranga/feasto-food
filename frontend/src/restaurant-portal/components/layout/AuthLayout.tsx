import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AuthIllustrationPanel from './AuthIllustrationPanel';
import PortalLoader from '../common/PortalLoader';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#F3F0E8] font-sans antialiased text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518]">
      {/* Left side: content forms card */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 min-h-screen bg-[#F3F0E8] relative">
        {/* Subtle architectural hairline grain */}
        <div className="mx-auto w-full max-w-md bg-white border border-[#141518] p-8 sm:p-10 shadow-[4px_4px_0px_#141518] relative">
          {/* Studio Top Accent Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#141518]/15">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 bg-[#141518] text-[#D7F04A] font-black text-xs flex items-center justify-center font-heading">
                F
              </span>
              <div>
                <span className="font-heading font-black text-xs uppercase tracking-tight text-[#141518] block leading-none">
                  FEASTO
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8A8D98] block mt-0.5">
                  RESTAURANT STUDIO
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#141518] px-2 py-0.5 bg-[#FAF8F5] border border-[#141518]/20">
              SECURE ACCESS
            </span>
          </div>

          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>

        {/* Footer legal descriptor */}
        <div className="mx-auto w-full max-w-md mt-6 flex items-center justify-between text-[10px] font-mono text-[#8A8D98]">
          <span>© 2026 FEASTO HOSPITALITY TECH</span>
          <span>ENTERPRISE PASSKEY / 2FA</span>
        </div>
      </div>

      {/* Right side: visual illustration panel */}
      <AuthIllustrationPanel />
    </div>
  );
};
export default AuthLayout;
