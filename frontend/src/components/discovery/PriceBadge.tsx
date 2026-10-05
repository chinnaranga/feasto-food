import React from 'react';

type PriceRange = 'budget' | 'mid' | 'premium';

interface PriceBadgeProps {
  range: PriceRange;
}

const PRICE_MAP: Record<PriceRange, { label: string; className: string }> = {
  budget: { label: '₹', className: 'text-success-main' },
  mid: { label: '₹₹', className: 'text-[#f59e0b]' },
  premium: { label: '₹₹₹', className: 'text-brand-orange' },
};

export const PriceBadge: React.FC<PriceBadgeProps> = ({ range }) => {
  const { label, className } = PRICE_MAP[range];
  return (
    <span className={`text-xs font-bold ${className}`}>{label}</span>
  );
};

export default PriceBadge;
