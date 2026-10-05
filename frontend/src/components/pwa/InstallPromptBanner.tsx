import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstallPrompt } from '../../hooks/pwa/useInstallPrompt';

export const InstallPromptBanner: React.FC = () => {
  const { showInstallPrompt, triggerInstall, setShowInstallPrompt } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const dismissed = sessionStorage.getItem('feasto-install-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('feasto-install-dismissed', 'true');
    setIsDismissed(true);
    setShowInstallPrompt(false);
  };

  const handleInstall = async () => {
    const result = await triggerInstall();
    if (result) {
      sessionStorage.setItem('feasto-install-dismissed', 'true');
      setIsDismissed(true);
    }
  };

  // Section 22: Suppress install prompt during checkout, payment, authentication
  const isSuppressedRoute =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/payment') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/orders');

  if (!showInstallPrompt || isDismissed || isSuppressedRoute) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 left-6 z-[450] max-w-sm select-none"
      >
        <div className="relative p-5 bg-[#141518] text-[#F3F0E8] border border-black shadow-2xl rounded-2xl text-left">
          {/* Dismiss CTA */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-[#8A8D98] hover:text-[#F3F0E8] p-1 font-mono text-xs transition-colors"
            aria-label="Dismiss banner"
          >
            ×
          </button>

          <span className="font-mono text-[10px] uppercase tracking-widest text-[#D7F04A] block mb-1">
            Feasto Native PWA
          </span>
          <h4 className="font-heading font-bold text-sm text-[#F3F0E8] tracking-tight">
            Install Feasto to Home Screen
          </h4>
          <p className="font-sans text-xs text-[#8A8D98] mt-1.5 leading-relaxed">
            Instant kitchen alerts, live courier radar, and offline menu browsing.
          </p>

          <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={handleInstall}
              className="btn-graphic-acid text-[11px] py-2 px-3"
            >
              Install App →
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs font-mono text-[#8A8D98] hover:text-[#F3F0E8] px-2 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
