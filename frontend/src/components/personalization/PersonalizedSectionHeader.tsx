import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface PersonalizedSectionHeaderProps {
  title: string;
  subtitle?: string;
  onInfoClick?: () => void;
}

export const PersonalizedSectionHeader: React.FC<PersonalizedSectionHeaderProps> = ({
  title,
  subtitle,
  onInfoClick,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 text-left">
      <div>
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-brand-orange/10 text-brand-orange rounded-lg">
            <Sparkles size={13} className="animate-pulse" />
          </div>
          <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider font-heading">
            {title}
          </h3>
          <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
            AI Customized
          </span>
        </div>
        {subtitle && (
          <p className="text-[10px] text-text-secondary mt-1 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {onInfoClick && (
        <button
          onClick={onInfoClick}
          className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-secondary-bg transition-main cursor-pointer"
          title="How Feasto adapts recommendations to your preferences"
          aria-label="View personalization settings explanation"
        >
          <Info size={14} />
        </button>
      )}
    </div>
  );
};
