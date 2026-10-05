import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { useObservabilityStore } from '../../store/observability/observabilityStore';
import { useRecoverySignals } from '../../hooks/observability/useRecoverySignals';

export const ErrorTelemetryBanner: React.FC = () => {
  const { bannerVisible, bannerMessage, setBannerVisible } = useObservabilityStore();
  const { resetApplication } = useRecoverySignals();

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[9995] bg-primary-bg border border-red-500/20 rounded-2xl shadow-deep p-4 flex gap-3.5 backdrop-blur-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-red-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-text-primary mb-1">
              Application Error Logged
            </h4>
            <p className="text-[11px] text-text-secondary leading-normal mb-3">
              {bannerMessage || 'An unexpected runtime error occurred. We have captured this diagnostic event to improve service quality.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={resetApplication}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-main cursor-pointer"
              >
                <RotateCcw size={10} />
                Restore App
              </button>
              <button
                onClick={() => setBannerVisible(false)}
                className="px-3 py-1.5 bg-surface-bg hover:bg-secondary-bg border border-border-main text-text-secondary text-[10px] font-semibold rounded-lg transition-main cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={() => setBannerVisible(false)}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-main"
            aria-label="Close dialog"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ErrorTelemetryBanner;
