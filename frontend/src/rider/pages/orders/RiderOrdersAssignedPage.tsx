import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { RiderButton, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderOrdersAssignedPage: React.FC = () => {
  const navigate = useNavigate();
  const { offers } = useRiderOrdersStore();

  const assignedOffers = offers.filter((o) => o.status === 'accepted' || o.status === 'in_transit');

  return (
    <div className="space-y-4 text-left">
      {assignedOffers.length > 0 ? (
        <div className="space-y-3">
          {assignedOffers.map((offer) => (
            <div key={offer.id} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{offer.orderNumber}</span>
                  <h4 className="text-sm font-black text-neutral-900 font-heading">{offer.restaurantName}</h4>
                </div>
                <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  Assigned
                </span>
              </div>

              <div className="text-xs text-neutral-600 space-y-1">
                <span>Deliver to: <strong className="text-neutral-900">{offer.customerName}</strong> ({offer.dropoffAddress})</span>
                <span className="block font-mono text-emerald-700 font-bold pt-1">
                  Payout: ₹{offer.payoutAmount + offer.tipAmount + offer.surgeBonusAmount}
                </span>
              </div>

              <RiderButton variant="primary" fullWidth onClick={() => navigate('/rider/active')}>
                Open Active Delivery Workflow →
              </RiderButton>
            </div>
          ))}
        </div>
      ) : (
        <RiderEmptyState
          title="No Currently Assigned Tasks"
          description="Accept a job offer from the Available tab to view assigned courier tasks."
        />
      )}
    </div>
  );
};

export default RiderOrdersAssignedPage;
