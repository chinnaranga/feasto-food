import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, ShieldCheck, Sparkles, BarChart2, Heart, Megaphone } from 'lucide-react';
import { CookieCategoryConfig, CookieCategoryKey } from '../../types/privacyConsent';
import { ConsentStatusBadge } from './ConsentStatusBadge';
import { PrivacyCategoryToggle } from './PrivacyCategoryToggle';

interface PrivacyCategoryCardProps {
  category: CookieCategoryConfig;
  isEnabled: boolean;
  onToggle: (key: CookieCategoryKey, value: boolean) => void;
}

const CATEGORY_ICONS: Record<CookieCategoryKey, React.ReactNode> = {
  necessary: <ShieldCheck size={18} className="text-neutral-700" />,
  functional: <Sparkles size={18} className="text-amber-600" />,
  analytics: <BarChart2 size={18} className="text-blue-600" />,
  personalization: <Heart size={18} className="text-rose-500" />,
  marketing: <Megaphone size={18} className="text-purple-600" />,
};

export const PrivacyCategoryCard: React.FC<PrivacyCategoryCardProps> = ({
  category,
  isEnabled,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleId = `cookie-toggle-${category.id}`;
  const detailsId = `cookie-details-${category.id}`;

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs hover:border-neutral-300 transition-all duration-200 text-left">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-neutral-100/90 border border-neutral-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            {CATEGORY_ICONS[category.id]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h4 className="text-sm font-bold text-neutral-900 font-heading tracking-tight">
                {category.title}
              </h4>
              <ConsentStatusBadge
                isAlwaysActive={category.isStrictlyNecessary}
                isActive={isEnabled}
              />
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed mt-1">
              {category.shortDescription}
            </p>
          </div>
        </div>

        {/* Action Toggle */}
        <div className="shrink-0 flex items-center pt-0.5">
          <PrivacyCategoryToggle
            id={toggleId}
            checked={isEnabled}
            disabled={category.isStrictlyNecessary}
            onChange={(checked) => onToggle(category.id, checked)}
            ariaLabel={`Toggle ${category.title} cookies`}
          />
        </div>
      </div>

      {/* Expand / Collapse Trigger */}
      <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer py-1 px-1 -ml-1 rounded-md focus-visible:outline-2 focus-visible:outline-brand-orange"
        >
          <Info size={13} className="text-neutral-400" aria-hidden="true" />
          <span>{isExpanded ? 'Hide details' : 'Learn more'}</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-neutral-400 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        <span className="text-[11px] font-medium text-neutral-400 select-none">
          {category.firstParty ? 'First-party verified' : 'Partner integration'}
        </span>
      </div>

      {/* Expandable Details Accordion */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={detailsId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 pt-3.5 border-t border-dashed border-neutral-200/80 space-y-3 text-xs bg-neutral-50/70 p-4 rounded-xl">
              <div>
                <span className="font-bold text-neutral-800 block mb-0.5">Purpose</span>
                <p className="text-neutral-600 leading-relaxed">{category.purpose}</p>
              </div>

              <div>
                <span className="font-bold text-neutral-800 block mb-0.5">Data Use & Processing</span>
                <p className="text-neutral-600 leading-relaxed">{category.dataUse}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="font-bold text-neutral-800 block text-[11px]">Storage Type</span>
                  <span className="text-neutral-600 text-[11px]">{category.type}</span>
                </div>
                <div>
                  <span className="font-bold text-neutral-800 block text-[11px]">Typical Duration</span>
                  <span className="text-neutral-600 text-[11px]">{category.duration}</span>
                </div>
              </div>

              {category.examples.length > 0 && (
                <div>
                  <span className="font-bold text-neutral-800 block text-[11px] mb-1.5">Identifiers & Keys</span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.examples.map((item) => (
                      <code
                        key={item}
                        className="px-2 py-0.5 text-[10px] font-mono bg-white border border-neutral-200 rounded-md text-neutral-700 select-all"
                      >
                        {item}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyCategoryCard;
