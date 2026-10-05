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
    <div className="space-y-4 text-left">
      {/* Duty Status Card */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Duty Status</span>
            <h3 className="text-base font-black text-neutral-900 font-heading">
              {availability === 'online' ? 'You are On Duty' : 'You are Off Duty'}
            </h3>
          </div>
          <RiderStatusPill availability={availability} />
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          {availability === 'online'
            ? 'Receiving trip offers near Bandra West & Khar Zone.'
            : 'Turn On Duty to start receiving delivery offers in your area.'}
        </p>

        <RiderButton
          variant={availability === 'online' ? 'outline' : 'primary'}
          fullWidth
          onClick={toggleAvailability}
        >
          {availability === 'online' ? 'Go Off Duty' : 'Go On Duty Now'}
        </RiderButton>
      </div>

      {/* Today's Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <RiderSummaryTile
          title="Today's Earnings"
          value={`₹${earningsSummary.todayEarnings.toFixed(0)}`}
          subtitle={`${earningsSummary.todayTrips} trips completed`}
          icon={<Wallet size={16} />}
          highlight
        />
        <RiderSummaryTile
          title="Online Time"
          value={`${Math.floor(earningsSummary.todayOnlineMinutes / 60)}h ${earningsSummary.todayOnlineMinutes % 60}m`}
          subtitle={`₹${earningsSummary.todayTips} tips earned`}
          icon={<Clock size={16} />}
        />
      </div>

      {/* Active Task Prompt or Available Offers */}
      {activeOffer ? (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-amber-700 animate-pulse" />
              <span className="text-xs font-black uppercase text-amber-900 font-heading">Active Task in Progress</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800">{activeOffer.orderNumber}</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-neutral-900 font-heading">{activeOffer.restaurantName}</h4>
            <p className="text-xs text-neutral-600 truncate">Deliver to: {activeOffer.customerName}</p>
          </div>

          <RiderButton
            variant="primary"
            fullWidth
            onClick={() => navigate('/rider/active')}
          >
            Open Active Task Details →
          </RiderButton>
        </div>
      ) : deliveryOffers.length > 0 ? (
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#e35205]" />
              <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">
                New Offers Available ({deliveryOffers.length})
              </h4>
            </div>
            <button onClick={() => navigate('/rider/orders')} className="text-xs font-bold text-[#e35205] hover:underline">
              View All →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-between text-xs font-mono">
            <span>{deliveryOffers[0].restaurantName}</span>
            <strong className="text-emerald-700">₹{deliveryOffers[0].payoutAmount + deliveryOffers[0].tipAmount}</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RiderDashboardPage;
