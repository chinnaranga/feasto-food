import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Navigation, ShoppingBag, Clock, ArrowRight, Shield, Zap } from 'lucide-react';
import useRiderStore from '../store/useRiderStore';
import { RiderSummaryTile, RiderCard, RiderButton, RiderStatusPill } from '../components/RiderUIComponents';

export const RiderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, availability, earningsSummary, deliveryOffers, activeOffer, toggleAvailability } =
    useRiderStore();

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Duty Status Card */}
      <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[#55565B] uppercase tracking-wider">
              OPERATIONAL DUTY
            </span>
            <h3 className="text-base font-heading font-black text-[#141518] uppercase tracking-tight">
              {availability === 'online' ? 'ACTIVE ON DUTY' : 'STANDBY (OFF DUTY)'}
            </h3>
          </div>
          <RiderStatusPill availability={availability} />
        </div>

        <p className="text-xs text-[#55565B] leading-relaxed font-sans">
          {availability === 'online'
            ? 'Receiving priority trip offers near Bandra West, Khar & BKC dispatch zone.'
            : 'Switch to On Duty to activate GPS radar and start receiving high-payout orders.'}
        </p>

        <RiderButton
          variant={availability === 'online' ? 'outline' : 'primary'}
          fullWidth
          onClick={toggleAvailability}
        >
          {availability === 'online' ? 'GO OFF DUTY' : 'GO ON DUTY NOW'}
        </RiderButton>
      </div>

      {/* Today's Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <RiderSummaryTile
          title="TODAY REVENUE"
          value={`₹${earningsSummary.todayEarnings.toFixed(0)}`}
          subtitle={`${earningsSummary.todayTrips} DROPS COMPLETED`}
          icon={<Wallet size={16} />}
          highlight
        />
        <RiderSummaryTile
          title="ONLINE TIME"
          value={`${Math.floor(earningsSummary.todayOnlineMinutes / 60)}h ${earningsSummary.todayOnlineMinutes % 60}m`}
          subtitle={`₹${earningsSummary.todayTips} IN TIPS`}
          icon={<Clock size={16} />}
        />
      </div>

      {/* Active Task Prompt or Available Offers */}
      {activeOffer ? (
        <div className="p-5 bg-[#D7F04A]/20 border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-[#141518] animate-pulse" />
              <span className="text-xs font-black uppercase text-[#141518] tracking-wider">
                ACTIVE COURIER MISSION
              </span>
            </div>
            <span className="text-xs font-mono font-black px-2 py-0.5 bg-[#141518] text-[#D7F04A]">
              {activeOffer.orderNumber}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-heading font-black text-[#141518] uppercase">
              {activeOffer.restaurantName}
            </h4>
            <p className="text-xs text-[#55565B] truncate font-sans">
              Deliver to: <strong className="text-[#141518] font-mono">{activeOffer.customerName}</strong>
            </p>
          </div>

          <RiderButton
            variant="primary"
            fullWidth
            onClick={() => navigate('/rider/active')}
          >
            OPEN MISSION HUD DETAILS →
          </RiderButton>
        </div>
      ) : deliveryOffers.length > 0 ? (
        <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#141518]" />
              <h4 className="text-xs font-heading font-black uppercase text-[#141518] tracking-wider">
                NEW OFFERS IN RADAR ({deliveryOffers.length})
              </h4>
            </div>
            <button
              onClick={() => navigate('/rider/orders')}
              className="text-xs font-mono font-bold text-[#141518] underline underline-offset-4 decoration-[#D7F04A] decoration-2 hover:text-[#1B3BFF] cursor-pointer"
            >
              VIEW ALL →
            </button>
          </div>

          <div className="p-3 bg-[#F3F0E8] border border-[#141518] flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#141518]">{deliveryOffers[0].restaurantName}</span>
            <strong className="px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
              ₹{deliveryOffers[0].payoutAmount + deliveryOffers[0].tipAmount}
            </strong>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RiderDashboardPage;
