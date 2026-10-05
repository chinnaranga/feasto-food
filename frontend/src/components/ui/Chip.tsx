import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ChipProps {
  label: string;
  isActive?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  onSelect,
  onRemove,
  className = '',
}) => {
  return (
    <motion.div
      whileTap={onSelect ? { scale: 0.97 } : undefined}
      onClick={onSelect}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-main select-none ${
        onSelect ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
          : 'bg-white border-border-main text-text-secondary hover:bg-neutral-50 hover:text-text-primary hover:border-neutral-300'
      } ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/5 transition-colors cursor-pointer inline-flex items-center justify-center"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
};
