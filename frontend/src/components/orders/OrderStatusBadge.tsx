import React from 'react';
import type { OrderStatus } from '@/store/userStore';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  placed: { label: 'Order Placed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmed: { label: 'Confirmed', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  preparing: { label: 'Preparing', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  dispatched: { label: 'Out for Delivery', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_MAP[status] ?? { label: status, className: 'bg-secondary-bg text-text-muted border-border-main' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};
