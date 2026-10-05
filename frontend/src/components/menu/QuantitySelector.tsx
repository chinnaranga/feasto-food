import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
}) => {
  const base = size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  const numSize = size === 'sm' ? 'text-xs w-6' : size === 'lg' ? 'text-lg w-10' : 'text-sm w-8';

  return (
    <div className="inline-flex items-center gap-1 bg-secondary-bg border border-border-main rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${base} flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-bg disabled:opacity-30 disabled:cursor-not-allowed transition-main cursor-pointer`}
      >
        <Minus size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} />
      </button>
      <span className={`${numSize} text-center font-black text-text-primary tabular-nums select-none`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${base} flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-bg disabled:opacity-30 disabled:cursor-not-allowed transition-main cursor-pointer`}
      >
        <Plus size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} />
      </button>
    </div>
  );
};

export default QuantitySelector;
