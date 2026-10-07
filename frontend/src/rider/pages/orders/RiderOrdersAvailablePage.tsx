import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Navigation, MapPin, Clock, Wallet, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import useRiderOrdersStore from '../../store/useRiderOrdersStore';
import { OrderOfferCard } from '../../components/orders/RiderOrdersComponents';
import { RiderButton, RiderEmptyState, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderOrdersAvailablePage: React.FC = () => {
  const navigate = useNavigate();
  const { offers, acceptOffer, openDeclineModal } = useRiderOrdersStore();

  const availableOffers = offers.filter((o) => o.status === 'available');
  const [selectedOfferId, setSelectedOfferId] = useState<string>(availableOffers[0]?.id || '');

  const activeOffer = availableOffers.find((o) => o.id === selectedOfferId) || availableOffers[0];

  const handleAccept = (id: string) => {
    acceptOffer(id);
    navigate('/rider/active');
  };

  return (
    <div className="space-y-6 text-left font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#141518]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-[#141518] uppercase tracking-tight">
            AVAILABLE DISPATCH QUEUE
          </h1>
          <p className="text-xs text-[#55565B] font-mono mt-0.5">
            {availableOffers.length} real-time mission offers near Bandra West & Khar Zone.
          </p>
        </div>

        <span className="text-xs font-mono font-black px-3 py-1.5 bg-[#D7F04A] text-[#141518] border border-[#141518] shadow-[2px_2px_0px_#141518] w-fit">
          ● RADAR RADIAL SCAN ACTIVE
        </span>
      </div>

      {availableOffers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Offers List */}
          <div className="lg:col-span-5 space-y-3">
            {availableOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`transition-all cursor-pointer ${
                  activeOffer?.id === offer.id
                    ? 'border-2 border-[#141518] shadow-[5px_5px_0px_#141518]'
                    : ''
                }`}
              >
                <OrderOfferCard
                  offer={offer}
                  onAccept={handleAccept}
                  onDecline={(id) => openDeclineModal(id)}
                  onViewDetails={(id) => navigate(`/rider/orders/${id}`)}
                />
              </div>
            ))}
          </div>

          {/* Right Column: Selected Order Detail Workspace Pane */}
          {activeOffer && (
            <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-[#141518]/15 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#55565B] uppercase tracking-widest">
                    MISSION DOSSIER • {activeOffer.orderNumber}
                  </span>
                  <h2 className="text-xl font-heading font-black text-[#141518] uppercase tracking-tight">
                    {activeOffer.restaurantName}
                  </h2>
                  <span className="text-xs text-[#55565B] font-mono block">
                    PICKUP: {activeOffer.restaurantAddress}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-[#141518] font-mono block px-2.5 py-1 bg-[#D7F04A] border border-[#141518]">
                    ₹{(activeOffer.payoutAmount + activeOffer.tipAmount + activeOffer.surgeBonusAmount).toFixed(0)}
                  </span>
                  <span className="text-[10px] text-[#55565B] font-mono block mt-1 uppercase">
                    INCL. ₹{activeOffer.tipAmount} TIP + ₹{activeOffer.surgeBonusAmount} SURGE
                  </span>
                </div>
              </div>

              {/* Delivery SLA & Route Distance Metrics */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                <div className="p-3 bg-[#F3F0E8] border border-[#141518] space-y-0.5">
                  <span className="text-[10px] text-[#55565B] uppercase block">DISTANCE</span>
                  <strong className="text-[#141518] text-sm block font-black">{activeOffer.totalDistanceKm} KM</strong>
                </div>

                <div className="p-3 bg-[#F3F0E8] border border-[#141518] space-y-0.5">
                  <span className="text-[10px] text-[#55565B] uppercase block">EST TIME</span>
                  <strong className="text-[#141518] text-sm block font-black">{activeOffer.estimatedTimeMins} MIN</strong>
                </div>

                <div className="p-3 bg-[#F3F0E8] border border-[#141518] space-y-0.5">
                  <span className="text-[10px] text-[#55565B] uppercase block">ACCEPT SLA</span>
                  <strong className="text-[#141518] text-sm block font-black">{activeOffer.expirySeconds}S LEFT</strong>
                </div>
              </div>

              {/* Itemized Order Package Items List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#141518] uppercase text-[10px] tracking-wider font-mono block">
                  PACKAGE SPECIFICATIONS ({activeOffer.itemCount} ITEMS)
                </span>
                <div className="p-4 bg-[#F3F0E8] border border-[#141518] space-y-1.5 font-mono">
                  {activeOffer.itemsList.map((itemStr: string, idx: number) => (
                    <div key={idx} className="flex justify-between text-[#141518]">
                      <span>• {itemStr}</span>
                      <span className="font-bold uppercase">✓ READY AT PASS</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Dropoff Location */}
              <div className="p-4 bg-[#F3F0E8] border border-[#141518] space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#141518] font-bold uppercase font-mono">
                  <MapPin size={14} className="text-[#141518]" />
                  <span>CUSTOMER DROP-OFF WAYPOINT</span>
                </div>
                <p className="text-[#141518] font-mono">{activeOffer.dropoffAddress}</p>
                {activeOffer.specialInstructions && (
                  <span className="text-[11px] text-[#55565B] font-mono block pt-1">
                    NOTE: "{activeOffer.specialInstructions}"
                  </span>
                )}
              </div>

              {/* Accept / Decline CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <RiderButton
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => openDeclineModal(activeOffer.id)}
                >
                  DECLINE OFFER
                </RiderButton>

                <RiderButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleAccept(activeOffer.id)}
                >
                  ACCEPT MISSION →
                </RiderButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <RiderEmptyState
          title="NO ACTIVE DISPATCH OFFERS IN SECTOR"
          description="Radar listening on 5G channel. Maintain active GPS vessel telemetry to receive upcoming high-surge offers."
        />
      )}
    </div>
  );
};

export default RiderOrdersAvailablePage;
