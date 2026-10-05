import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AuthIllustrationPanel from './AuthIllustrationPanel';
import PortalLoader from '../common/PortalLoader';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white font-sans antialiased text-[#111827]">
      {/* Left side: content forms card */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24 min-h-screen">
        <div className="mx-auto w-full max-w-sm">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      {/* Right side: visual illustration panel */}
      <AuthIllustrationPanel />
    </div>
  );
};
export default AuthLayout;
