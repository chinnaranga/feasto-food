import React from 'react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { WalletCard } from '../../components/earnings/RiderEarningsComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsWalletPage: React.FC = () => {
  const { wallet, setTransferModalOpen } = useRiderEarningsStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Rider Wallet Balance" subtitle="Manage available funds, linked bank accounts, and instant settlements." />
      <WalletCard wallet={wallet} onOpenTransfer={() => setTransferModalOpen(true)} />
    </div>
  );
};

export default RiderEarningsWalletPage;
