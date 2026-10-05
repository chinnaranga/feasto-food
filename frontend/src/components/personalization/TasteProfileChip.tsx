import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface TasteProfileChipProps {
  label: string;
  onDismiss?: () => void;
  isSparkle?: boolean;
}

export const TasteProfileChip: React.FC<TasteProfileChipProps> = ({ label, onDismiss, isSparkle }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fef3c7]/60 border border-[#fde68a] text-amber-900 rounded-xl text-[10px] font-extrabold uppercase tracking-wide shadow-xs select-none">
      {isSparkle && <Sparkles size={10} className="text-amber-600 animate-pulse" />}
      <span>{label}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="hover:bg-amber-200/50 p-0.5 rounded-full transition-main cursor-pointer"
          aria-label={`Remove preference ${label}`}
        >
          <X size={10} className="text-amber-800" />
        </button>
      )}
    </div>
  );
};
