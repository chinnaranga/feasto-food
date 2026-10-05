import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { EarningsSubNavTabBar, InstantTransferModal } from '../../components/earnings/RiderEarningsComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsLayout: React.FC = () => {
  const { summary, wallet, isTransferModalOpen, setTransferModalOpen, initiateInstantTransfer } =
    useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <RiderPageHeader
          title="Rider Earnings & Wallet Hub"
          subtitle={`Today's Total: ₹${summary.todayTotal.toFixed(0)} • ${summary.completedTripsCount} Deliveries`}
        />
        <button
          onClick={() => setTransferModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          Wallet: ₹{wallet.availableBalance.toFixed(0)}
        </button>
      </div>

      {/* Sub-Nav Scrollable Tab Bar */}
      <EarningsSubNavTabBar />

      {/* Main View Container */}
      <Suspense fallback={<div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Financial Telemetry...</div>}>
        <Outlet />
      </Suspense>

      {/* Instant Transfer Modal */}
      <InstantTransferModal
        isOpen={isTransferModalOpen}
        wallet={wallet}
        onClose={() => setTransferModalOpen(false)}
        onConfirmTransfer={initiateInstantTransfer}
      />
    </div>
  );
};

export default RiderEarningsLayout;
