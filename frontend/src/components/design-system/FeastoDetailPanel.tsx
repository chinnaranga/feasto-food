import React from 'react';
import { X } from 'lucide-react';

/**
 * FEASTO DETAIL PANEL
 * Inspector panel for detailed operational views (Order details, restaurant dossier,
 * rider tracking, customer inspection).
 */

interface FeastoDetailPanelProps {
  title: string;
  subtitle?: string;
  index?: string;
  onClose?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export const FeastoDetailPanel: React.FC<FeastoDetailPanelProps> = ({
  title,
  subtitle,
  index,
  onClose,
  children,
  actions,
  dark = false,
  className = '',
}) => {
  return (
    <div
      className={`border flex flex-col h-full text-left select-none overflow-hidden ${
        dark
          ? 'bg-[#14161B] border-white/10 text-white'
          : 'bg-white border-[#141518] text-[#141518]'
      } ${className}`}
    >
      {/* Panel Header */}
      <div
        className={`p-5 border-b flex items-start justify-between gap-4 ${
          dark ? 'border-white/10 bg-[#1D212A]' : 'border-[#141518]/15 bg-[#FAF8F5]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8A8D98]">
            {index && <span className="text-[#1B3BFF] font-bold">{index}</span>}
            <span>OPERATIONAL INSPECTOR</span>
          </div>
          <h3 className="font-heading font-black text-xl uppercase tracking-tight text-current mt-0.5">
            {title}
          </h3>
          {subtitle && (
            <p className="font-mono text-xs text-[#52555F] dark:text-[#8E929C] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 border border-current/20 hover:bg-current/10 transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        {children}
      </div>

      {/* Panel Footer Actions */}
      {actions && (
        <div
          className={`p-4 border-t ${
            dark ? 'border-white/10 bg-[#1D212A]' : 'border-[#141518]/15 bg-[#FAF8F5]'
          }`}
        >
          {actions}
        </div>
      )}
    </div>
  );
};
