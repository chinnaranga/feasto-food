import React from 'react';

/**
 * FEASTO STATUS INDICATOR
 * Unifies state visualization across Customer, Restaurant, Rider, and Admin.
 * Replaces generic rounded pills and inconsistent badges with an architectural,
 * high-contrast status language.
 */

export type FeastoStatusKind =
  // Orders
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'
  // Restaurant / Merchant
  | 'open'
  | 'busy'
  | 'paused'
  | 'offline'
  // Rider
  | 'on_duty'
  | 'off_duty'
  | 'en_route'
  | 'arrived'
  // Admin & System
  | 'operational'
  | 'degraded'
  | 'outage'
  | 'pending'
  | 'verified'
  | 'flagged'
  | 'suspended';

interface FeastoStatusProps {
  status: FeastoStatusKind | string;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIGS: Record<
  string,
  { label: string; text: string; bg: string; border: string; dot: string; pulse: boolean }
> = {
  // Orders
  placed: {
    label: 'New Order',
    text: 'text-amber-900',
    bg: 'bg-amber-100/70',
    border: 'border-amber-400',
    dot: 'bg-amber-500',
    pulse: true,
  },
  confirmed: {
    label: 'Confirmed',
    text: 'text-[#1B3BFF]',
    bg: 'bg-[#1B3BFF]/10',
    border: 'border-[#1B3BFF]/30',
    dot: 'bg-[#1B3BFF]',
    pulse: false,
  },
  preparing: {
    label: 'Preparing',
    text: 'text-violet-900',
    bg: 'bg-violet-100/70',
    border: 'border-violet-400',
    dot: 'bg-violet-600',
    pulse: true,
  },
  ready: {
    label: 'Ready for Pickup',
    text: 'text-emerald-950',
    bg: 'bg-[#D7F04A]/60',
    border: 'border-[#141518]',
    dot: 'bg-[#141518]',
    pulse: true,
  },
  picked_up: {
    label: 'In Transit',
    text: 'text-sky-900',
    bg: 'bg-sky-100/70',
    border: 'border-sky-400',
    dot: 'bg-sky-600',
    pulse: false,
  },
  delivered: {
    label: 'Delivered',
    text: 'text-[#52555F]',
    bg: 'bg-[#FAF8F5]',
    border: 'border-[#E2DED4]',
    dot: 'bg-[#8A8D98]',
    pulse: false,
  },
  cancelled: {
    label: 'Cancelled',
    text: 'text-red-900',
    bg: 'bg-red-100/60',
    border: 'border-red-400',
    dot: 'bg-red-600',
    pulse: false,
  },

  // Merchant
  open: {
    label: 'Accepting Orders',
    text: 'text-emerald-900',
    bg: 'bg-emerald-100/60',
    border: 'border-emerald-400',
    dot: 'bg-emerald-600',
    pulse: true,
  },
  busy: {
    label: 'Kitchen Busy',
    text: 'text-amber-900',
    bg: 'bg-amber-100/60',
    border: 'border-amber-400',
    dot: 'bg-amber-600',
    pulse: true,
  },
  paused: {
    label: 'Orders Paused',
    text: 'text-stone-800',
    bg: 'bg-stone-200/70',
    border: 'border-stone-400',
    dot: 'bg-stone-600',
    pulse: false,
  },
  offline: {
    label: 'Station Offline',
    text: 'text-[#8A8D98]',
    bg: 'bg-stone-100',
    border: 'border-stone-300',
    dot: 'bg-stone-400',
    pulse: false,
  },

  // Rider
  on_duty: {
    label: 'On Duty · Online',
    text: 'text-[#141518]',
    bg: 'bg-[#D7F04A]',
    border: 'border-[#141518]',
    dot: 'bg-[#141518]',
    pulse: true,
  },
  off_duty: {
    label: 'Off Duty',
    text: 'text-[#8A8D98]',
    bg: 'bg-[#14161B]',
    border: 'border-white/10',
    dot: 'bg-[#8A8D98]',
    pulse: false,
  },
  en_route: {
    label: 'Navigating to Dropoff',
    text: 'text-white',
    bg: 'bg-[#1B3BFF]',
    border: 'border-[#1B3BFF]',
    dot: 'bg-white',
    pulse: true,
  },
  arrived: {
    label: 'Arrived at Location',
    text: 'text-[#141518]',
    bg: 'bg-[#D7F04A]',
    border: 'border-[#141518]',
    dot: 'bg-[#141518]',
    pulse: false,
  },

  // Admin & System
  operational: {
    label: 'All Systems Nominal',
    text: 'text-emerald-900',
    bg: 'bg-emerald-100/60',
    border: 'border-emerald-400',
    dot: 'bg-emerald-600',
    pulse: true,
  },
  degraded: {
    label: 'Degraded Performance',
    text: 'text-amber-900',
    bg: 'bg-amber-100/60',
    border: 'border-amber-400',
    dot: 'bg-amber-600',
    pulse: true,
  },
  outage: {
    label: 'Critical Outage',
    text: 'text-red-950',
    bg: 'bg-red-200/80',
    border: 'border-red-600',
    dot: 'bg-red-700',
    pulse: true,
  },
  pending: {
    label: 'Pending Review',
    text: 'text-amber-900',
    bg: 'bg-amber-100/70',
    border: 'border-amber-400',
    dot: 'bg-amber-600',
    pulse: false,
  },
  verified: {
    label: 'Verified & Active',
    text: 'text-emerald-900',
    bg: 'bg-emerald-100/60',
    border: 'border-emerald-400',
    dot: 'bg-emerald-600',
    pulse: false,
  },
  flagged: {
    label: 'Flagged by Sentinel',
    text: 'text-red-900',
    bg: 'bg-red-100/70',
    border: 'border-red-400',
    dot: 'bg-red-600',
    pulse: true,
  },
  suspended: {
    label: 'Account Suspended',
    text: 'text-stone-900',
    bg: 'bg-stone-300',
    border: 'border-stone-500',
    dot: 'bg-stone-700',
    pulse: false,
  },
};

export const FeastoStatus: React.FC<FeastoStatusProps> = ({
  status,
  label,
  pulse,
  size = 'md',
  className = '',
}) => {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, '_');
  const cfg = STATUS_CONFIGS[normalizedKey] || {
    label: label || status,
    text: 'text-[#141518]',
    bg: 'bg-[#FAF8F5]',
    border: 'border-[#E2DED4]',
    dot: 'bg-[#141518]',
    pulse: false,
  };

  const displayLabel = label || cfg.label;
  const isPulsing = pulse !== undefined ? pulse : cfg.pulse;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider border select-none ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {isPulsing && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${cfg.dot}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 ${cfg.dot}`} />
      </span>
      <span className="truncate">{displayLabel}</span>
    </span>
  );
};
