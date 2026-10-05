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
          className="fixed bottom-0 left-0 right-0 lg:left-64 z-[9990] bg-neutral-900 text-white border-t border-neutral-800 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] select-none"
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            
            {/* Warning alert message */}
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-[#e35205] shrink-0 animate-pulse" />
              <span className="text-xs font-semibold text-neutral-200">
                You have unsaved changes in your workspace setup.
              </span>
            </div>

            {/* CTA controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={discardEdits}
                className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-main cursor-pointer"
              >
                Discard
              </button>
              <Button
                type="button"
                variant="primary"
                onClick={saveProfile}
                className="bg-[#e35205] hover:bg-[#c94804] border-0 text-white font-black text-xs px-4 py-2 shadow-sm rounded-xl shrink-0"
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
