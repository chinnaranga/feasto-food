import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { OrderOfferCard } from '../../components/orders/RiderOrdersComponents';
import { RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderOrdersScheduledPage: React.FC = () => {
  const navigate = useNavigate();
  const { offers, acceptOffer, openDeclineModal } = useRiderOrdersStore();

  const scheduledOffers = offers.filter((o) => o.deliveryType === 'scheduled_catering');

  const handleAccept = (id: string) => {
    acceptOffer(id);
    navigate('/rider/active');
  };

  return (
    <div className="space-y-4 text-left">
      {scheduledOffers.length > 0 ? (
        <div className="space-y-3">
          {scheduledOffers.map((offer) => (
            <OrderOfferCard
              key={offer.id}
              offer={offer}
              onAccept={handleAccept}
              onDecline={(id) => openDeclineModal(id)}
              onViewDetails={(id) => navigate(`/rider/orders/${id}`)}
            />
          ))}
        </div>
      ) : (
        <RiderEmptyState
          title="No Scheduled Catering Offers"
          description="Pre-scheduled catering and advance delivery opportunities will be listed here."
        />
      )}
    </div>
  );
};

export default RiderOrdersScheduledPage;
