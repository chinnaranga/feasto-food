import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { ProfileHeader, ProfileSubNavTabBar, SaveChangesBar } from '../../components/profile/RiderProfileComponents';

export const RiderProfileLayout: React.FC = () => {
  const { personalInfo, readiness, hasUnsavedChanges, saveChanges } = useRiderProfileStore();

  return (
    <div className="space-y-4 text-left">
      {/* Profile Overview Header */}
      <ProfileHeader personalInfo={personalInfo} readinessPct={readiness.overallScorePct} />

      {/* Sub-Nav Scrollable Tab Bar */}
      <ProfileSubNavTabBar />

      {/* Active Tab Page Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Profile Section...</div>}>
        <Outlet />
      </Suspense>

      {/* Sticky Save Changes Bar */}
      {hasUnsavedChanges && <SaveChangesBar onSave={saveChanges} />}
    </div>
  );
};

export default RiderProfileLayout;
