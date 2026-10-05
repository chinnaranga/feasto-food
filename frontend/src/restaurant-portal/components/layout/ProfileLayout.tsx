import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import ProfileTabs from '../ui/ProfileTabs';
import ProfileCompletenessMeter from '../ui/ProfileCompletenessMeter';
import SaveChangesBar from '../ui/SaveChangesBar';
import PortalLoader from '../common/PortalLoader';

export const ProfileLayout: React.FC = () => {
  return (
    <PageContainer className="pb-24">
      {/* Page Header */}
      <PortalPageHeader
        title="Restaurant Workspace Configurations"
        description="Verify your brand details, legal GST status, regional parameters, and operational hours."
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
        
        {/* Main tabs view card panel */}
        <div className="flex-1 w-full bg-white border border-neutral-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[500px]">
          {/* Sub-tabs bar */}
          <ProfileTabs />
          
          {/* Active Tab Content */}
          <div className="p-6 flex-grow">
            <Suspense fallback={<PortalLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>

        {/* Right side panels: Profile completeness */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <ProfileCompletenessMeter />
        </div>

      </div>

      {/* Slide-up Save changes trigger */}
      <SaveChangesBar />
    </PageContainer>
  );
};
export default ProfileLayout;
