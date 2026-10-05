import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Package, Check, ArrowLeft } from 'lucide-react';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { PriorityBadge } from '../../components/orders/RiderOrdersComponents';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offers, acceptOffer, openDeclineModal } = useRiderOrdersStore();

  const offer = offers.find((o) => o.id === id) || offers[0];

  const handleAccept = () => {
    acceptOffer(offer.id);
    navigate('/rider/active');
  };

  const totalPayout = offer.payoutAmount + offer.tipAmount + offer.surgeBonusAmount;

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-600">
          <ArrowLeft size={18} />
        </button>
        <RiderPageHeader title={`Order Specifications ${offer.orderNumber}`} subtitle={offer.restaurantName} />
      </div>

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <PriorityBadge level={offer.priorityLevel} />
          <span className="text-xl font-black font-mono text-emerald-700">₹{totalPayout.toFixed(0)}</span>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Pickup Location</span>
            <strong className="text-neutral-900 block text-sm">{offer.restaurantName}</strong>
            <span className="text-neutral-600 block">{offer.restaurantAddress}</span>
            <span className="text-emerald-700 font-mono font-bold block pt-1">SLA: {offer.pickupSla}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Delivery Address</span>
            <strong className="text-neutral-900 block text-sm">{offer.customerName}</strong>
            <span className="text-neutral-600 block">{offer.dropoffAddress}</span>
          </div>
        </div>

        {/* Itemized Food List */}
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <h4 className="font-bold text-neutral-900 font-heading">Itemized Order Items ({offer.itemCount})</h4>
          <ul className="space-y-1 text-neutral-700 font-mono">
            {offer.itemsList.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Package size={14} className="text-[#e35205]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {offer.specialInstructions && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <strong>Special Handling Notes:</strong> {offer.specialInstructions}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <RiderButton variant="outline" size="lg" fullWidth onClick={() => openDeclineModal(offer.id)}>
            Decline Offer
          </RiderButton>
          <RiderButton variant="primary" size="lg" fullWidth onClick={handleAccept}>
            Accept & Deliver →
          </RiderButton>
        </div>
      </div>
    </div>
  );
};

export default RiderOrderDetailPage;
