import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { useReleaseStore } from '../../store/release/releaseStore';

export const VersionMismatchBanner: React.FC = () => {
  const { versionMismatch, triggerUpdateReload, dismissMismatchBanner, metadata } = useReleaseStore();

  return (
    <AnimatePresence>
      {versionMismatch && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-4 px-4 py-2.5 bg-brand-orange text-white text-sm font-semibold shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw size={15} className="shrink-0 animate-spin" />
            <span>
              Feasto v{metadata.version} is available. Refresh to get the latest experience.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={triggerUpdateReload}
              className="px-3 py-1 bg-white text-brand-orange text-xs font-bold rounded-lg hover:bg-orange-50 transition-main"
              aria-label="Update now"
            >
              Update Now
            </button>
            <button
              onClick={dismissMismatchBanner}
              className="p-1 rounded-lg hover:bg-white/20 transition-main"
              aria-label="Dismiss update banner"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default VersionMismatchBanner;
