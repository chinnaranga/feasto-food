import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  X,
  HelpCircle,
  ChevronDown,
  Lock,
  Layers,
} from 'lucide-react';
import { usePrivacyConsent } from '../../hooks/security/usePrivacyConsent';
import { COOKIE_CATEGORIES_CONFIG, CookieCategoryKey } from '../../types/privacyConsent';
import { PrivacyCategoryCard } from './PrivacyCategoryCard';
import { Button } from '../ui/Button';

export const PrivacyPreferencesDialog: React.FC = () => {
  const {
    isPreferencesModalOpen,
    closePreferencesModal,
    draftPreferences,
    setDraftCategory,
    saveDraftPreferences,
    acceptAll,
    rejectOptional,
  } = usePrivacyConsent();

  const [isCookieExplanationOpen, setIsCookieExplanationOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Lock body scroll and handle focus trap
  useEffect(() => {
    if (isPreferencesModalOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus first focusable element
      setTimeout(() => {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreferencesModalOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreferencesModalOpen) {
        closePreferencesModal();
      }
    };

    if (isPreferencesModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreferencesModalOpen, closePreferencesModal]);

  // Calculate active categories count
  const activeCount = [
    draftPreferences.necessary,
    draftPreferences.functional,
    draftPreferences.analytics,
    draftPreferences.personalization,
    draftPreferences.marketing,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isPreferencesModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-dialog-title"
          aria-describedby="privacy-dialog-desc"
          className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreferencesModal}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-neutral-200/90 shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh] text-left select-none"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-neutral-100 bg-white sticky top-0 z-20">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <ShieldCheck size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3
                      id="privacy-dialog-title"
                      className="text-base sm:text-lg font-black text-neutral-900 font-heading tracking-tight"
                    >
                      Privacy & Cookie Preferences
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      <Layers size={11} className="text-neutral-500" />
                      <span>{activeCount} of 5 Active</span>
                    </span>
                  </div>
                  <p id="privacy-dialog-desc" className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Manage how Feasto uses cookies and similar technologies.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePreferencesModal}
                aria-label="Close preferences dialog"
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 px-6 py-5 overflow-y-auto space-y-4 bg-neutral-50/40">
              {/* "What are cookies?" Accordion */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4.5 shadow-2xs text-left">
                <button
                  type="button"
                  onClick={() => setIsCookieExplanationOpen(!isCookieExplanationOpen)}
                  aria-expanded={isCookieExplanationOpen}
                  className="w-full flex items-center justify-between gap-3 text-left font-bold text-xs text-neutral-800 hover:text-brand-orange transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={15} className="text-brand-orange shrink-0" />
                    <span>What are cookies and how do we use them?</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 text-neutral-400 ${
                      isCookieExplanationOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isCookieExplanationOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 text-xs text-neutral-600 space-y-2.5 leading-relaxed">
                        <p>
                          Cookies are small pieces of information stored by your browser or device. They help
                          Feasto remember your settings, maintain secure sessions, and understand how the service
                          is used.
                        </p>
                        <p>
                          We also utilize localStorage and sessionStorage for quick interface rendering, language
                          selection, and cart resilience. You have full transparency and control over every optional
                          category.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5 Cookie Categories Cards */}
              <div className="space-y-3">
                {COOKIE_CATEGORIES_CONFIG.map((category) => (
                  <PrivacyCategoryCard
                    key={category.id}
                    category={category}
                    isEnabled={draftPreferences[category.id]}
                    onToggle={(key: CookieCategoryKey, value: boolean) => setDraftCategory(key, value)}
                  />
                ))}
              </div>

              {/* Legal Transparency Note */}
              <div className="p-3.5 bg-neutral-100/70 border border-neutral-200/60 rounded-xl text-[11px] text-neutral-500 flex items-center gap-2">
                <Lock size={13} className="text-neutral-400 shrink-0" />
                <span>
                  Consent choices are securely recorded in compliance with GDPR, CCPA, and global privacy standards.
                </span>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4.5 bg-white border-t border-neutral-100 shadow-2xs sticky bottom-0 z-20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={rejectOptional}
                className="w-full sm:w-auto text-xs font-bold h-10 px-4 rounded-xl text-neutral-600 hover:text-neutral-900 border-neutral-200 hover:bg-neutral-50"
              >
                Reject Optional
              </Button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveDraftPreferences}
                  className="flex-1 sm:flex-none text-xs font-bold h-10 px-5 rounded-xl border-neutral-300 text-neutral-800 hover:bg-neutral-50 shadow-2xs"
                >
                  Save Preferences
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 sm:flex-none text-xs font-bold h-10 px-6 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white shadow-soft"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPreferencesDialog;
