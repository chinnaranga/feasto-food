import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie } from 'lucide-react';
import { usePrivacyConsent } from '../../hooks/security/usePrivacyConsent';
import { Button } from '../ui/Button';

export const ConsentBanner: React.FC = () => {
  const {
    isBannerOpen,
    openPreferencesModal,
    acceptAll,
    rejectOptional,
  } = usePrivacyConsent();

  if (!isBannerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label="Privacy and Cookie Consent Banner"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-lg bg-white border border-neutral-200/90 p-5 sm:p-6 rounded-3xl shadow-2xl z-[1900] flex flex-col gap-4 text-left select-none"
      >
        {/* Header and Explanation */}
        <div className="flex items-start gap-3.5 text-xs">
          <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <ShieldCheck size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-neutral-900 tracking-tight font-heading text-sm">
                Privacy & Cookie Preferences
              </h4>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed mt-1.5">
              We use cookies and similar technologies to keep Feasto secure, remember your preferences, understand product usage, and improve recommendations.
            </p>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={rejectOptional}
            className="text-xs font-bold h-9 px-3.5 text-neutral-500 hover:text-neutral-900 rounded-xl hover:bg-neutral-100"
          >
            Reject Optional
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPreferencesModal}
            className="text-xs font-bold h-9 px-4 rounded-xl border-neutral-300 text-neutral-800 hover:bg-neutral-50 shadow-2xs"
          >
            Manage Preferences
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={acceptAll}
            className="text-xs font-bold h-9 px-5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl shadow-soft"
          >
            Accept All
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PrivacyConsentBanner = ConsentBanner;
export default ConsentBanner;
