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
      <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518] flex items-center gap-1 shadow-[1px_1px_0px_#141518]">
        <Zap size={11} className="fill-[#141518]" />
        <span>1.5X SURGE</span>
      </span>
    );
  }
  if (level === 'scheduled') {
    return (
      <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 bg-[#BFDBFE] text-[#141518] border border-[#141518] flex items-center gap-1 shadow-[1px_1px_0px_#141518]">
        <Clock size={11} />
        <span>SCHEDULED</span>
      </span>
    );
  }
  return (
    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F3F0E8] text-[#55565B] border border-[#141518]/30">
      STANDARD
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
    <div className="flex items-center gap-1 text-[11px] font-mono font-black text-[#141518]">
      <Clock size={12} className="animate-pulse" />
      <span>{seconds > 0 ? `${seconds}S REMAINING` : 'EXPIRED'}</span>
    </div>
  );
};

// ─── OrdersSubNavTabBar ──────────────────────────────────────────────────────
export const OrdersSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'AVAILABLE', path: '/rider/orders/available' },
    { label: '🔥 SURGE OFFERS', path: '/rider/orders/priority' },
    { label: 'SCHEDULED', path: '/rider/orders/scheduled' },
    { label: 'ASSIGNED', path: '/rider/orders/assigned' },
    { label: 'HISTORY', path: '/rider/orders/history' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/orders/available' || tab.path === '/rider/orders'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#FAF8F5] border-transparent text-[#55565B] hover:text-[#141518] hover:bg-[#F3F0E8] hover:border-[#141518]/20'
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
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-left font-mono">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-[#55565B] uppercase">
              {offer.orderNumber}
            </span>
            <PriorityBadge level={offer.priorityLevel} />
          </div>
          <h4 className="text-sm font-heading font-black text-[#141518] uppercase tracking-tight">
            {offer.restaurantName}
          </h4>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-[#141518] font-mono block leading-none px-2 py-1 bg-[#D7F04A] border border-[#141518]">
            ₹{totalPayout.toFixed(0)}
          </span>
          <span className="text-[10px] text-[#55565B] font-mono block mt-1 uppercase">
            (+₹{offer.tipAmount} TIP)
          </span>
        </div>
      </div>

      {/* Addresses & Distance Telemetry */}
      <div className="space-y-2 text-xs text-[#141518]">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#141518] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">PICKUP (KITCHEN)</span>
            <strong className="block text-[#141518]">{offer.restaurantAddress}</strong>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#55565B] shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">DROP-OFF (CUSTOMER)</span>
            <strong className="block text-[#141518]">{offer.customerName} ({offer.dropoffAddress})</strong>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#141518]/15 text-[11px] font-mono text-[#55565B]">
          <span>DISTANCE: <strong className="text-[#141518]">{offer.totalDistanceKm} KM</strong></span>
          <span>EST: <strong className="text-[#141518]">{offer.estimatedTimeMins} MIN</strong></span>
          <span>BAG: <strong className="text-[#141518]">{offer.itemCount} ITEMS</strong></span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-between bg-[#F3F0E8] p-2.5 border border-[#141518]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#55565B]">ACCEPTANCE WINDOW</span>
        <ExpiryTimer initialSeconds={offer.expirySeconds} />
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <RiderButton variant="outline" size="sm" onClick={() => onDecline(offer.id)}>
          DECLINE
        </RiderButton>
        <RiderButton variant="ghost" size="sm" onClick={() => onViewDetails(offer.id)}>
          SPECS
        </RiderButton>
        <RiderButton variant="primary" size="sm" onClick={() => onAccept(offer.id)}>
          ACCEPT JOB →
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
    { id: 'distance_too_far', label: 'Trip distance exceeds zone radius' },
    { id: 'payout_too_low', label: 'Payout rate insufficient for traffic route' },
    { id: 'vehicle_unsuitable', label: 'Order parcel exceeds vessel cargo capacity' },
    { id: 'taking_break', label: 'Taking an operational rest break' },
    { id: 'other', label: 'Other dispatch constraint' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-[#FAF8F5] border border-[#141518] p-6 shadow-[6px_6px_0px_#141518] space-y-4 text-left z-10 font-mono">
        <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
          <h3 className="text-sm font-heading font-black text-[#141518] uppercase">
            DECLINE DISPATCH OFFER
          </h3>
          <button
            onClick={onClose}
            className="p-1 border border-[#141518] bg-[#FAF8F5] hover:bg-[#F3F0E8] text-[#141518]"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-xs text-[#55565B] leading-relaxed font-sans">
          Select reason for declining. Feasto dispatch AI recalibrates nearby vessels.
        </p>

        <div className="space-y-2">
          {reasons.map((r) => (
            <label
              key={r.id}
              onClick={() => setSelectedReason(r.id)}
              className={`p-3 border flex items-center justify-between text-xs font-mono font-bold cursor-pointer transition-all ${
                selectedReason === r.id
                  ? 'bg-[#D7F04A] border-[#141518] text-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#F3F0E8] border-[#141518]/30 text-[#141518] hover:border-[#141518]'
              }`}
            >
              <span>{r.label}</span>
              <input
                type="radio"
                checked={selectedReason === r.id}
                onChange={() => {}}
                className="accent-[#141518]"
              />
            </label>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            CANCEL
          </RiderButton>
          <RiderButton variant="danger" fullWidth onClick={() => onConfirmDecline(selectedReason)}>
            CONFIRM DECLINE
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
