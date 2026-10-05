import React from 'react';
import { Clock } from 'lucide-react';

interface DeliveryBadgeProps {
  minutes: number;
  free?: boolean;
  fee?: number;
}

export const DeliveryBadge: React.FC<DeliveryBadgeProps> = ({ minutes, free, fee }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary">
    <Clock size={12} className="shrink-0" />
    <span>{minutes} min</span>
    {free ? (
      <span className="text-success-main font-bold ml-1">Free delivery</span>
    ) : fee !== undefined && fee > 0 ? (
      <span className="ml-1">· ₹{fee} delivery</span>
    ) : null}
  </span>
);

export default DeliveryBadge;
