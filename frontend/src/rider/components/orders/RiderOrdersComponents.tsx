import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  AlertCircle,
  Phone,
  ChevronRight,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Package,
} from 'lucide-react';
import type { DeliveryOfferItem, OrderSortOption, DeclineReason } from '../../types/orders';
import { RiderButton } from '../RiderUIComponents';

// ─── PriorityBadge ───────────────────────────────────────────────────────────
export const PriorityBadge: React.FC<{ level: DeliveryOfferItem['priorityLevel'] }> = ({ level }) => {
  if (level === 'high_surge') {
    return (
      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-mono">
        <Zap size={11} className="text-amber-600 fill-amber-500" />
        <span>1.5x Surge Bonus</span>
      </span>
    );
  }
  if (level === 'scheduled') {
    return (
      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1 font-mono">
        <Clock size={11} className="text-blue-600" />
        <span>Scheduled Catering</span>
      </span>
    );
  }
  return (
    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-mono">
      Standard Delivery
    </span>
  );
};

// ─── ExpiryTimer ─────────────────────────────────────────────────────────────
export const ExpiryTimer: React.FC<{ initialSeconds: number }> = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div className="flex items-center gap-1 text-[11px] font-mono font-black text-amber-700">
      <Clock size={12} className="animate-pulse" />
      <span>{seconds > 0 ? `${seconds}s remaining` : 'Offer Expired'}</span>
    </div>
  );
};

// ─── OrdersSubNavTabBar ──────────────────────────────────────────────────────
export const OrdersSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Available Offers', path: '/rider/orders/available' },
    { label: '🔥 Priority Surge', path: '/rider/orders/priority' },
    { label: 'Scheduled', path: '/rider/orders/scheduled' },
    { label: 'Assigned', path: '/rider/orders/assigned' },
    { label: 'Offer History', path: '/rider/orders/history' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/orders/available' || tab.path === '/rider/orders'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// ─── OrderOfferCard ──────────────────────────────────────────────────────────
export const OrderOfferCard: React.FC<{
  offer: DeliveryOfferItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onViewDetails: (id: string) => void;
}> = ({ offer, onAccept, onDecline, onViewDetails }) => {
  const totalPayout = offer.payoutAmount + offer.tipAmount + offer.surgeBonusAmount;

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-left">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{offer.orderNumber}</span>
            <PriorityBadge level={offer.priorityLevel} />
          </div>
          <h4 className="text-sm font-black text-neutral-900 font-heading">{offer.restaurantName}</h4>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-emerald-700 font-mono block leading-none">
            ₹{totalPayout.toFixed(0)}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono block mt-1">
            (Includes ₹{offer.tipAmount} tip)
          </span>
        </div>
      </div>

      {/* Addresses & Distance Telemetry */}
      <div className="space-y-2 text-xs text-neutral-600">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#e35205] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Pickup Location</span>
            <strong className="text-neutral-900 block">{offer.restaurantAddress}</strong>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Deliver to Customer</span>
            <strong className="text-neutral-900 block">{offer.customerName} ({offer.dropoffAddress})</strong>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px] font-mono text-neutral-500">
          <span>Distance: <strong className="text-neutral-800">{offer.totalDistanceKm} km</strong></span>
          <span>Est: <strong className="text-neutral-800">{offer.estimatedTimeMins} mins</strong></span>
          <span>Items: <strong className="text-neutral-800">{offer.itemCount} items</strong></span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-150">
        <span className="text-[11px] text-neutral-600 font-medium">Acceptance SLA Window</span>
        <ExpiryTimer initialSeconds={offer.expirySeconds} />
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-3 gap-2">
        <RiderButton variant="outline" size="md" onClick={() => onDecline(offer.id)}>
          Decline
        </RiderButton>
        <RiderButton variant="ghost" size="md" onClick={() => onViewDetails(offer.id)}>
          Specs
        </RiderButton>
        <RiderButton variant="primary" size="md" onClick={() => onAccept(offer.id)}>
          Accept Job
        </RiderButton>
      </div>
    </div>
  );
};

// ─── DeclineReasonModal ──────────────────────────────────────────────────────
export const DeclineReasonModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecline: (reason: DeclineReason) => void;
}> = ({ isOpen, onClose, onConfirmDecline }) => {
  const [selectedReason, setSelectedReason] = useState<DeclineReason>('distance_too_far');

  if (!isOpen) return null;

  const reasons: { id: DeclineReason; label: string }[] = [
    { id: 'distance_too_far', label: 'Trip distance is too far' },
    { id: 'payout_too_low', label: 'Payout amount is too low for this route' },
    { id: 'vehicle_unsuitable', label: 'Order size exceeds vehicle bag capacity' },
    { id: 'taking_break', label: 'Taking a shift break / Going off duty' },
    { id: 'other', label: 'Other operational reason' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-modal space-y-4 text-left z-10">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-sm font-black text-neutral-900 font-heading">Decline Delivery Offer</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">
          Please select a reason for declining this delivery offer. This helps optimize future order matching.
        </p>

        <div className="space-y-2">
          {reasons.map((r) => (
            <label
              key={r.id}
              onClick={() => setSelectedReason(r.id)}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-colors ${
                selectedReason === r.id
                  ? 'bg-[#e35205]/5 border-[#e35205] text-[#e35205]'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <span>{r.label}</span>
              <input type="radio" checked={selectedReason === r.id} onChange={() => {}} className="accent-[#e35205]" />
            </label>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            Cancel
          </RiderButton>
          <RiderButton variant="danger" fullWidth onClick={() => onConfirmDecline(selectedReason)}>
            Confirm Decline
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
