import React from 'react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { StatusStepper } from '../../components/active/RiderActiveComponents';
import { RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActiveStatusPage: React.FC = () => {
  const { activeTask } = useRiderActiveStore();

  if (!activeTask) {
    return <RiderEmptyState title="No Active Status" description="Accept a job offer to view live status progression." />;
  }

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Live Delivery Status Progression" subtitle="7-Step real-time status update telemetry." />
      <StatusStepper currentStage={activeTask.currentStage} />
    </div>
  );
};

export default RiderActiveStatusPage;
