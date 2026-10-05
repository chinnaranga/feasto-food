import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/pwa/useOnlineStatus';
import { PWA_MESSAGES } from '../../constants/pwa';

export const OfflineBanner: React.FC = () => {
  const { isOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-2 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-full bg-error-main/90 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <WifiOff size={14} className="animate-pulse" />
            <span>{PWA_MESSAGES.OFFLINE}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
