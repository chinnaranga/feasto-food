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
    <div className="space-y-4 text-left font-mono">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-[#FAF8F5] border border-[#141518] text-[#141518] hover:bg-[#F3F0E8] shadow-[2px_2px_0px_#141518] cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <RiderPageHeader
          title={`ORDER DOSSIER ${offer.orderNumber}`}
          subtitle={offer.restaurantName}
        />
      </div>

      <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
          <PriorityBadge level={offer.priorityLevel} />
          <span className="text-xl font-black font-mono text-[#141518] px-2.5 py-1 bg-[#D7F04A] border border-[#141518]">
            ₹{totalPayout.toFixed(0)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-[#F3F0E8] border border-[#141518] space-y-1">
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">PICKUP LOCATION</span>
            <strong className="text-[#141518] block text-sm">{offer.restaurantName}</strong>
            <span className="text-[#55565B] block">{offer.restaurantAddress}</span>
            <span className="text-[#141518] font-mono font-bold block pt-1">SLA: {offer.pickupSla}</span>
          </div>

          <div className="p-3 bg-[#F3F0E8] border border-[#141518] space-y-1">
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">DROP-OFF LOCATION</span>
            <strong className="text-[#141518] block text-sm">{offer.customerName}</strong>
            <span className="text-[#55565B] block">{offer.dropoffAddress}</span>
          </div>
        </div>

        {/* Itemized Food List */}
        <div className="space-y-2 pt-2 border-t border-[#141518]/15">
          <h4 className="font-bold text-[#141518] uppercase">CARGO ITEMS ({offer.itemCount})</h4>
          <ul className="space-y-1.5 text-[#141518] font-mono">
            {offer.itemsList.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Package size={14} className="text-[#141518]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {offer.specialInstructions && (
          <div className="p-3 bg-[#FEF08A] border border-[#141518] text-[#854D0E] font-mono text-xs">
            <strong>SPECIAL HANDLING:</strong> {offer.specialInstructions}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <RiderButton
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => openDeclineModal(offer.id)}
          >
            DECLINE
          </RiderButton>
          <RiderButton variant="primary" size="lg" fullWidth onClick={handleAccept}>
            ACCEPT & START →
          </RiderButton>
        </div>
      </div>
    </div>
  );
};

export default RiderOrderDetailPage;
