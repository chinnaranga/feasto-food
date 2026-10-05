import React from 'react';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderOrdersHistoryPage: React.FC = () => {
  const { offers } = useRiderOrdersStore();

  const historyOffers = offers.filter((o) => o.status === 'declined' || o.status === 'expired');

  return (
    <div className="space-y-4 text-left">
      {historyOffers.length > 0 ? (
        <div className="space-y-3">
          {historyOffers.map((offer) => (
            <div key={offer.id} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-neutral-900">{offer.orderNumber} • {offer.restaurantName}</span>
                <span className="text-red-600 font-bold uppercase text-[9px] px-2 py-0.5 rounded bg-red-50 border border-red-200">
                  {offer.status}
                </span>
              </div>
              <p className="text-neutral-500">{offer.dropoffAddress} • {offer.totalDistanceKm} km</p>
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState title="No Past Declined Offers" description="Offers that you decline or expire will appear in this history audit log." />
      )}
    </div>
  );
};

export default RiderOrdersHistoryPage;
