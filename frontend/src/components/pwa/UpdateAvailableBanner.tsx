import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useServiceWorkerUpdate } from '../../hooks/pwa/useServiceWorkerUpdate';
import { Button } from '../ui/Button';
import { PWA_MESSAGES } from '../../constants/pwa';

export const UpdateAvailableBanner: React.FC = () => {
  const { isUpdateAvailable, applyUpdate } = useServiceWorkerUpdate();

  return (
    <AnimatePresence>
      {isUpdateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-[9998] max-w-md"
        >
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border-main bg-primary-bg shadow-lg backdrop-blur-md">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-orange/10 text-brand-orange shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-text-primary">Update Available</h4>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {PWA_MESSAGES.UPDATE_READY}
                </p>
              </div>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              onClick={applyUpdate}
              className="shrink-0"
            >
              <RefreshCw size={14} />
              Update
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
