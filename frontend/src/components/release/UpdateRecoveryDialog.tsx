import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useUpdateRecovery } from '../../hooks/release/useUpdateRecovery';

export const UpdateRecoveryDialog: React.FC = () => {
  const { showUpdateRecovery, recoveryErrorMsg, recoverApp, closeRecoveryDialog } = useUpdateRecovery();

  return (
    <AnimatePresence>
      {showUpdateRecovery && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={closeRecoveryDialog}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 pointer-events-none"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="recovery-dialog-title"
          >
            <div className="relative pointer-events-auto bg-primary-bg border border-border-main rounded-2xl shadow-deep w-full max-w-sm p-6">
              <button
                onClick={closeRecoveryDialog}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-bg transition-main"
                aria-label="Close recovery dialog"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-amber-500" />
                </div>
                <div>
                  <h2 id="recovery-dialog-title" className="text-base font-bold text-text-primary mb-1">
                    App Update Required
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {recoveryErrorMsg ?? 'A new version of Feasto is available. Please reload to apply the latest updates and restore full functionality.'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={recoverApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-[#c94804] text-white text-sm font-bold rounded-xl transition-main"
                    aria-label="Reload application"
                  >
                    <RefreshCw size={14} />
                    Reload App
                  </button>
                  <button
                    onClick={closeRecoveryDialog}
                    className="w-full px-4 py-2.5 bg-surface-bg hover:bg-secondary-bg border border-border-main text-text-secondary text-sm font-semibold rounded-xl transition-main"
                    aria-label="Continue without reloading"
                  >
                    Continue Without Reload
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default UpdateRecoveryDialog;
