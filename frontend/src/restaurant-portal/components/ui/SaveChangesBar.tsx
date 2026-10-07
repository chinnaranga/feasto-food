import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import Button from './Button';

export const SaveChangesBar: React.FC = () => {
  const { isDirty, saveProfile, discardEdits } = usePortalProfileStore();

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 lg:left-64 z-[9990] bg-[#141518] text-[#FAF8F5] border-t-2 border-[#D7F04A] shadow-[0_-4px_24px_rgba(20,21,24,0.35)] select-none"
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 font-mono">
            {/* Warning alert message */}
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-[#D7F04A] shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-[#FAF8F5] uppercase tracking-wider">
                Unsaved modifications in workspace configurations
              </span>
            </div>

            {/* CTA controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={discardEdits}
                className="px-4 py-2 text-xs font-bold text-[#FAF8F5]/70 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
              >
                Discard
              </button>
              <Button
                type="button"
                variant="acid"
                onClick={saveProfile}
                className="font-bold text-xs px-5 py-2 shrink-0 uppercase tracking-wider"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveChangesBar;
