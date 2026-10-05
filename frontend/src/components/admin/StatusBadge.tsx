import React from 'react';

export interface StatusBadgeProps {
  value: string;
  type?: 'status' | 'role' | 'priority';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  type = 'status',
  className = '',
}) => {
  const normValue = value.toLowerCase();

  const getStyleClasses = (): string => {
    // 1. Priority colors mapping
    if (type === 'priority') {
      if (normValue === 'high') return 'bg-error-main/5 border-error-main/15 text-error-main font-extrabold';
      if (normValue === 'medium') return 'bg-amber-500/5 border-amber-500/15 text-amber-500';
      return 'bg-text-muted/5 border-border-main text-text-secondary';
    }

    // 2. Role colors mapping
    if (type === 'role') {
      if (normValue === 'admin' || normValue === 'super_admin') return 'bg-purple-500/5 border-purple-500/15 text-purple-600 font-extrabold';
      if (normValue === 'owner' || normValue === 'manager') return 'bg-brand-orange/5 border-brand-orange/15 text-brand-orange';
      if (normValue === 'rider') return 'bg-blue-500/5 border-blue-500/15 text-blue-600';
      if (normValue === 'support') return 'bg-teal-500/5 border-teal-500/15 text-teal-600';
      return 'bg-text-muted/5 border-border-main text-text-primary';
    }

    // 3. Status colors mapping
    switch (normValue) {
      case 'verified':
      case 'active':
      case 'resolved':
      case 'delivered':
        return 'bg-success-main/5 border-success-main/15 text-success-main font-bold';
      
      case 'pending':
      case 'preparing':
      case 'placed':
        return 'bg-amber-500/5 border-amber-500/15 text-amber-500 font-semibold';
      
      case 'dispatched':
      case 'on_delivery':
      case 'scheduled':
        return 'bg-blue-500/5 border-blue-500/15 text-blue-600 font-semibold';
      
      case 'suspended':
      case 'cancelled':
      case 'offline':
        return 'bg-error-main/5 border-error-main/15 text-error-main font-bold';
      
      default:
        return 'bg-text-muted/5 border-border-main text-text-secondary';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase select-none ${getStyleClasses()} ${className}`}
    >
      {value.replace('_', ' ')}
    </span>
  );
};
