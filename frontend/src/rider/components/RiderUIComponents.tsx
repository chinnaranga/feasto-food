import React from 'react';
import { Shield, AlertCircle, X, Search, Check, Layers } from 'lucide-react';
import type { RiderAvailability, DeliveryStep } from '../types';

// ─── RiderButton ─────────────────────────────────────────────────────────────
export interface RiderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'acid';
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
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase transition-all cursor-pointer select-none border border-[#141518] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none outline-none';

  const variantStyles = {
    primary: 'bg-[#D7F04A] hover:bg-[#cbf130] text-[#141518] shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
    secondary: 'bg-[#141518] hover:bg-[#25272c] text-[#FAF8F5] shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
    outline: 'bg-[#FAF8F5] hover:bg-[#F3F0E8] text-[#141518] shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
    ghost: 'bg-transparent border-transparent text-[#141518] hover:bg-[#141518]/5 shadow-none',
    danger: 'bg-[#EF4444] hover:bg-[#dc2626] text-white shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
    success: 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
    acid: 'bg-[#D7F04A] hover:bg-[#cbf130] text-[#141518] shadow-[3px_3px_0px_#141518] active:shadow-[1px_1px_0px_#141518]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5 min-h-[34px]',
    md: 'px-4.5 py-2.5 text-xs gap-2 min-h-[42px]',
    lg: 'px-6 py-3.5 text-sm gap-2.5 min-h-[50px]',
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
    className={`p-2.5 bg-[#FAF8F5] border border-[#141518] text-[#141518] shadow-[2px_2px_0px_#141518] hover:bg-[#F3F0E8] transition-colors cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ─── RiderStatusPill ─────────────────────────────────────────────────────────
export const RiderStatusPill: React.FC<{ availability: RiderAvailability }> = ({ availability }) => {
  const styles: Record<RiderAvailability, string> = {
    online: 'bg-[#D7F04A] text-[#141518] border-[#141518] shadow-[2px_2px_0px_#141518]',
    offline: 'bg-[#FAF8F5] text-[#55565B] border-[#141518]/30',
    on_delivery: 'bg-[#1B3BFF] text-white border-[#141518] shadow-[2px_2px_0px_#141518]',
    paused: 'bg-[#F3F0E8] text-[#141518] border-[#141518]',
  };

  const labels: Record<RiderAvailability, string> = {
    online: '● ON DUTY',
    offline: '○ STANDBY (OFF)',
    on_delivery: '⚡ EN ROUTE',
    paused: '⏸ PAUSED',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 border ${styles[availability]}`}
    >
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
    <div
      className={`p-4 border border-[#141518] text-left space-y-2 transition-all ${
        highlight
          ? 'bg-[#D7F04A]/15 border-[#141518] shadow-[3px_3px_0px_#141518]'
          : 'bg-[#FAF8F5] shadow-[3px_3px_0px_#141518]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#55565B]">
          {title}
        </span>
        <div
          className={`p-1.5 border border-[#141518] ${
            highlight ? 'bg-[#D7F04A] text-[#141518]' : 'bg-[#F3F0E8] text-[#141518]'
          }`}
        >
          {icon}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-mono font-black text-[#141518] leading-none">{value}</h4>
        {subtitle && <p className="text-[11px] text-[#55565B] font-mono mt-1.5">{subtitle}</p>}
      </div>
    </div>
  );
};

// ─── RiderCard ───────────────────────────────────────────────────────────────
export const RiderCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] text-left space-y-3 ${className}`}
  >
    {children}
  </div>
);

// ─── RiderContainer ──────────────────────────────────────────────────────────
export const RiderContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`w-full max-w-xl mx-auto p-4 sm:p-6 pb-24 space-y-5 text-left ${className}`}>
    {children}
  </div>
);

// ─── RiderPageHeader ─────────────────────────────────────────────────────────
export const RiderPageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#141518]/15">
    <div className="space-y-1">
      <h2 className="text-lg sm:text-xl font-heading font-black text-[#141518] uppercase tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-xs text-[#55565B] leading-relaxed font-sans">{subtitle}</p>}
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
    {label && (
      <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block">
        {label}
      </label>
    )}
    <input
      className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs text-[#141518] placeholder:text-[#55565B]/60 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#141518] font-mono ${className}`}
      {...props}
    />
  </div>
);

// ─── RiderSkeleton ───────────────────────────────────────────────────────────
export const RiderSkeleton: React.FC<{ className?: string }> = ({ className = 'h-12 w-full' }) => (
  <div className={`bg-[#E8E4DA] border border-[#141518]/20 animate-pulse ${className}`} />
);

// ─── RiderEmptyState ─────────────────────────────────────────────────────────
export const RiderEmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="p-8 text-center bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3">
    <div className="w-12 h-12 bg-[#F3F0E8] border border-[#141518] flex items-center justify-center mx-auto text-[#141518]">
      <Layers size={22} />
    </div>
    <h4 className="text-sm font-heading font-black text-[#141518] uppercase">{title}</h4>
    <p className="text-xs text-[#55565B] max-w-xs mx-auto leading-relaxed font-sans">{description}</p>
    {actionLabel && onAction && (
      <RiderButton variant="primary" size="sm" onClick={onAction} className="mt-2">
        {actionLabel}
      </RiderButton>
    )}
  </div>
);

// ─── RiderErrorState ─────────────────────────────────────────────────────────
export const RiderErrorState: React.FC<{ title?: string; message: string; onRetry?: () => void }> = ({
  title = 'Operational Alert',
  message,
  onRetry,
}) => (
  <div className="p-5 text-left bg-[#FEE2E2] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-2.5">
    <div className="flex items-center gap-2 text-[#991B1B] font-mono font-bold text-xs uppercase">
      <AlertCircle size={16} />
      <span>{title}</span>
    </div>
    <p className="text-xs text-[#7F1D1D] leading-relaxed">{message}</p>
    {onRetry && (
      <RiderButton variant="outline" size="sm" onClick={onRetry}>
        Retry Action
      </RiderButton>
    )}
  </div>
);

export default RiderButton;
