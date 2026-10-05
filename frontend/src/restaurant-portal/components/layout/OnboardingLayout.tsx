import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import OnboardingSidebar from './OnboardingSidebar';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import PortalLoader from '../common/PortalLoader';

export const OnboardingLayout: React.FC = () => {
  const { currentStepIndex, completedSteps } = usePortalOnboardingStore();

  return (
    <div className="min-h-screen flex bg-white font-sans antialiased text-[#111827]">
      {/* Sidebar step status tree */}
      <OnboardingSidebar
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
      />

      {/* Main stepper form workspace */}
      <div className="flex-1 flex flex-col min-h-screen relative bg-[#fafafb]/50">
        
        {/* Dynamic top-edge progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-100">
          <div
            className="h-full bg-[#e35205] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / 7) * 100}%` }}
          />
        </div>

        <div className="flex-grow flex flex-col justify-center items-center py-12 px-6 sm:px-12 lg:px-16 w-full max-w-3xl mx-auto">
          <div className="w-full bg-white border border-neutral-200/80 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <Suspense fallback={<PortalLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingLayout;
