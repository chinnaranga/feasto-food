import React from 'react';
import { Shield, AlertCircle, X, Search, Check, Layers } from 'lucide-react';
import type { RiderAvailability, DeliveryStep } from '../types';

// ─── RiderButton ─────────────────────────────────────────────────────────────
export interface RiderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const RiderButton: React.FC<RiderButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all cursor-pointer select-none active:scale-[0.98] outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variantStyles = {
    primary: 'bg-[#e35205] hover:bg-[#c94804] text-white shadow-3xs',
    secondary: 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-3xs',
    outline: 'border border-neutral-300 hover:bg-neutral-100 text-neutral-800 bg-white',
    ghost: 'hover:bg-neutral-100/80 text-neutral-700 bg-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-3xs',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-3xs',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[36px]',
    md: 'px-4.5 py-2.5 text-xs gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-sm gap-2.5 min-h-[52px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// ─── RiderIconButton ─────────────────────────────────────────────────────────
export const RiderIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    className={`p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ─── RiderStatusPill ─────────────────────────────────────────────────────────
export const RiderStatusPill: React.FC<{ availability: RiderAvailability }> = ({ availability }) => {
  const styles: Record<RiderAvailability, string> = {
    online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    offline: 'bg-neutral-100 text-neutral-600 border-neutral-250',
    on_delivery: 'bg-amber-50 text-amber-700 border-amber-200',
    paused: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const labels: Record<RiderAvailability, string> = {
    online: '● ON DUTY',
    offline: 'OFF DUTY',
    on_delivery: '⚡ ON DELIVERY',
    paused: '⏸ PAUSED',
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${styles[availability]}`}>
      {labels[availability]}
    </span>
  );
};

// ─── RiderSummaryTile ────────────────────────────────────────────────────────
export interface SummaryTileProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export const RiderSummaryTile: React.FC<SummaryTileProps> = ({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
}) => {
  return (
    <div className={`p-4 rounded-2xl border shadow-2xs text-left space-y-2 transition-all ${
      highlight ? 'bg-[#e35205]/5 border-[#e35205]/30' : 'bg-white border-neutral-200/90'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg ${highlight ? 'bg-[#e35205]/10 text-[#e35205]' : 'bg-neutral-100 text-neutral-600'}`}>
          {icon}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-black text-neutral-900 font-mono leading-none">{value}</h4>
        {subtitle && <p className="text-[11px] text-neutral-500 font-medium mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

// ─── RiderCard ───────────────────────────────────────────────────────────────
export const RiderCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-3 ${className}`}>
    {children}
  </div>
);

// ─── RiderContainer ──────────────────────────────────────────────────────────
export const RiderContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`w-full max-w-lg mx-auto p-4 pb-24 space-y-5 text-left ${className}`}>
    {children}
  </div>
);

// ─── RiderPageHeader ─────────────────────────────────────────────────────────
export const RiderPageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 pb-2">
    <div className="space-y-0.5">
      <h2 className="text-lg font-black text-neutral-900 font-heading tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-neutral-500 leading-relaxed">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// ─── RiderInput ──────────────────────────────────────────────────────────────
export const RiderInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({
  label,
  className = '',
  ...props
}) => (
  <div className="space-y-1 text-left w-full">
    {label && <label className="text-xs font-bold text-neutral-700 block">{label}</label>}
    <input
      className={`w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 font-sans ${className}`}
      {...props}
    />
  </div>
);

// ─── RiderSkeleton ───────────────────────────────────────────────────────────
export const RiderSkeleton: React.FC<{ className?: string }> = ({ className = 'h-12 w-full' }) => (
  <div className={`bg-neutral-200/60 rounded-xl animate-pulse ${className}`} />
);

// ─── RiderEmptyState ─────────────────────────────────────────────────────────
export const RiderEmptyState: React.FC<{ title: string; description: string; actionLabel?: string; onAction?: () => void }> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
      <Layers size={22} />
    </div>
    <h4 className="text-sm font-black text-neutral-900 font-heading">{title}</h4>
    <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <RiderButton variant="primary" size="sm" onClick={onAction} className="mt-2">
        {actionLabel}
      </RiderButton>
    )}
  </div>
);

// ─── RiderErrorState ─────────────────────────────────────────────────────────
export const RiderErrorState: React.FC<{ title?: string; message: string; onRetry?: () => void }> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
}) => (
  <div className="p-6 text-center bg-red-50/70 border border-red-200 rounded-2xl space-y-3 text-left">
    <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
      <AlertCircle size={16} />
      <span>{title}</span>
    </div>
    <p className="text-xs text-red-600">{message}</p>
    {onRetry && (
      <RiderButton variant="outline" size="sm" onClick={onRetry}>
        Try Again
      </RiderButton>
    )}
  </div>
);

export default RiderButton;
