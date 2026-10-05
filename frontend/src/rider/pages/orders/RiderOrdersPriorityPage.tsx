import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { OrderOfferCard } from '../../components/orders/RiderOrdersComponents';
import { RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderOrdersPriorityPage: React.FC = () => {
  const navigate = useNavigate();
  const { offers, acceptOffer, openDeclineModal } = useRiderOrdersStore();

  const priorityOffers = offers.filter((o) => o.priorityLevel === 'high_surge' && o.status === 'available');

  const handleAccept = (id: string) => {
    acceptOffer(id);
    navigate('/rider/active');
  };

  return (
    <div className="space-y-4 text-left">
      {priorityOffers.length > 0 ? (
        <div className="space-y-3">
          {priorityOffers.map((offer) => (
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
          title="No Priority Surge Offers Available"
          description="Priority 1.5x surge offers will appear here during peak lunch and dinner hours."
        />
      )}
    </div>
  );
};

export default RiderOrdersPriorityPage;
