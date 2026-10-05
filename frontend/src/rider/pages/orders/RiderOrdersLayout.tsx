import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { OrdersSubNavTabBar, DeclineReasonModal } from '../../components/orders/RiderOrdersComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderOrdersLayout: React.FC = () => {
  const { offers, isDeclineModalOpen, declinedOfferId, closeDeclineModal, declineOffer } = useRiderOrdersStore();

  const availableCount = offers.filter((o) => o.status === 'available').length;

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader
        title="Delivery Offers & Job Discovery"
        subtitle={`Review and accept delivery opportunities near your location. ${availableCount} jobs available.`}
      />

      {/* Sub-Nav Scrollable Tab Bar */}
      <OrdersSubNavTabBar />

      {/* Active Tab Page Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Offers...</div>}>
        <Outlet />
      </Suspense>

      {/* Decline Reason Modal */}
      <DeclineReasonModal
        isOpen={isDeclineModalOpen}
        onClose={closeDeclineModal}
        onConfirmDecline={(reason) => {
          if (declinedOfferId) {
            declineOffer(declinedOfferId, reason);
          }
        }}
      />
    </div>
  );
};

export default RiderOrdersLayout;
