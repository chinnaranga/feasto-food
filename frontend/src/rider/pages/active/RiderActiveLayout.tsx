import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { StatusStepper, ActiveSubNavTabBar, IssueReportModal } from '../../components/active/RiderActiveComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderActiveLayout: React.FC = () => {
  const { activeTask, isReportIssueModalOpen, setReportIssueModalOpen, reportException } =
    useRiderActiveStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader
        title={`Active Delivery ${activeTask?.orderNumber || '#1809'}`}
        subtitle={activeTask ? `${activeTask.restaurantName} -> Deliver to ${activeTask.customerName}` : 'Order Fulfillment'}
      />

      {/* 7-Step Status Stepper */}
      {activeTask && <StatusStepper currentStage={activeTask.currentStage} />}

      {/* Sub-Nav Scrollable Tab Bar */}
      <ActiveSubNavTabBar />

      {/* Main View Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Active Workflow...</div>}>
        <Outlet />
      </Suspense>

      {/* Issue Report Modal */}
      <IssueReportModal
        isOpen={isReportIssueModalOpen}
        onClose={() => setReportIssueModalOpen(false)}
        onConfirmReport={(type, notes) => reportException(type, notes)}
      />
    </div>
  );
};

export default RiderActiveLayout;
