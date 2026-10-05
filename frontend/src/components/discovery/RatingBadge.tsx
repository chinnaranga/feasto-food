import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, reviewCount, size = 'sm' }) => (
  <span className={`inline-flex items-center gap-1 font-bold text-text-primary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
    <Star size={size === 'sm' ? 12 : 14} className="text-[#f59e0b] fill-[#f59e0b]" />
    <span>{rating.toFixed(1)}</span>
    {reviewCount !== undefined && (
      <span className="text-text-muted font-medium">({reviewCount})</span>
    )}
  </span>
);

export default RatingBadge;
