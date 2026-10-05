import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { usePrivacyConsent } from '../../hooks/security/usePrivacyConsent';

export const ConsentConfirmationToast: React.FC = () => {
  const {
    isConfirmationToastVisible,
    confirmationMessage,
    confirmationDetail,
    dismissConfirmationToast,
    reopenFromConfirmation,
  } = usePrivacyConsent();

  return (
    <AnimatePresence>
      {isConfirmationToastVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 350 }}
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-md bg-white border border-neutral-200/90 rounded-2xl shadow-xl p-4 z-[2500] flex items-center justify-between gap-3 select-none text-left"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <CheckCircle2 size={18} className="stroke-[2.5]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-neutral-900 font-heading tracking-tight">
                {confirmationMessage || 'Preferences saved'}
              </h5>
              <p className="text-[11px] text-neutral-600 leading-snug mt-0.5">
                {confirmationDetail || 'Your privacy preferences have been updated.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={reopenFromConfirmation}
              className="text-[11px] font-bold text-brand-orange hover:text-brand-orange/80 bg-brand-orange/5 hover:bg-brand-orange/10 border border-brand-orange/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              Review Preferences
            </button>
            <button
              type="button"
              onClick={dismissConfirmationToast}
              aria-label="Dismiss confirmation"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentConfirmationToast;
