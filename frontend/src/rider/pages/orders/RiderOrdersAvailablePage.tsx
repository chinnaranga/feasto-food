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
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
            Available Dispatch Queue
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            {availableOffers.length} real-time delivery offers near Bandra West & Khar Zone.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 w-fit">
          ● Auto-Dispatch Active
        </span>
      </div>

      {availableOffers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Offers List (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3">
            {availableOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`transition-all cursor-pointer rounded-2xl ${
                  activeOffer?.id === offer.id ? 'ring-2 ring-[#e35205] shadow-md' : ''
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

          {/* Right Column: Selected Order Detail Workspace Pane (7 cols on lg) */}
          {activeOffer && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#e35205] uppercase">
                    Order Dispatch Summary • {activeOffer.orderNumber}
                  </span>
                  <h2 className="text-lg font-black text-neutral-900 font-heading">
                    {activeOffer.restaurantName}
                  </h2>
                  <span className="text-xs text-neutral-500 font-mono block">
                    Pickup: {activeOffer.restaurantAddress}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700 font-mono block">
                    ₹{(activeOffer.payoutAmount + activeOffer.tipAmount + activeOffer.surgeBonusAmount).toFixed(0)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono block">
                    Incl. ₹{activeOffer.tipAmount} Tip + ₹{activeOffer.surgeBonusAmount} Surge
                  </span>
                </div>
              </div>

              {/* Delivery SLA & Route Distance Metrics */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase block">Distance</span>
                  <strong className="text-neutral-900 text-sm block">{activeOffer.totalDistanceKm} KM</strong>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase block">Est Time</span>
                  <strong className="text-neutral-900 text-sm block">{activeOffer.estimatedTimeMins} Mins</strong>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase block">Accept SLA</span>
                  <strong className="text-amber-700 text-sm block">{activeOffer.expirySeconds}s Left</strong>
                </div>
              </div>

              {/* Itemized Order Package Items List */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider font-heading block">
                  Package Contents & Handling ({activeOffer.itemCount} Items)
                </span>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 font-mono">
                  {activeOffer.itemsList.map((itemStr: string, idx: number) => (
                    <div key={idx} className="flex justify-between text-neutral-700">
                      <span>• {itemStr}</span>
                      <span className="text-emerald-700 font-bold">✓ Prepared</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Dropoff Location */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <MapPin size={14} className="text-[#e35205]" />
                  <span>Customer Handoff Address</span>
                </div>
                <p className="text-neutral-600 font-mono">{activeOffer.dropoffAddress}</p>
                {activeOffer.specialInstructions && (
                  <span className="text-[11px] text-neutral-500 font-mono block pt-1">
                    Note: "{activeOffer.specialInstructions}"
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
                  Decline Offer
                </RiderButton>

                <RiderButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleAccept(activeOffer.id)}
                >
                  Accept Offer & Start →
                </RiderButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <RiderEmptyState
          title="No Available Offers Right Now"
          description="There are no open delivery offers matching your location. Stay online to receive live notifications."
        />
      )}
    </div>
  );
};

export default RiderOrdersAvailablePage;
