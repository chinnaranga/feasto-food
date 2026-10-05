import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { useEnvironmentReadiness } from '../../hooks/release/useEnvironmentReadiness';
import { useReleaseChannel } from '../../hooks/release/useReleaseChannel';

export const EnvironmentWarningCard: React.FC = () => {
  const { isValid, results } = useEnvironmentReadiness();
  const { isProduction } = useReleaseChannel();

  // Only show in non-production channels if env is invalid
  if (isValid || isProduction) return null;

  const failedKeys = results.filter((r) => r.isRequired && !r.exists);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-24 right-4 z-[9990] w-80 bg-primary-bg border border-amber-500/30 rounded-2xl shadow-deep overflow-hidden"
        role="alert"
        aria-label="Environment configuration warning"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-500/8 border-b border-amber-500/20">
          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
          <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide">
            Environment Warning
          </h3>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs text-text-secondary leading-relaxed">
            {failedKeys.length} required environment variable{failedKeys.length > 1 ? 's are' : ' is'} missing.
            The app may not function correctly.
          </p>

          <ul className="flex flex-col gap-2">
            {failedKeys.map(({ key, description }) => (
              <li key={key} className="flex items-start gap-2">
                <XCircle size={13} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary">{key}</span>
                  <p className="text-[10px] text-text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 pt-1 border-t border-border-main">
            <Info size={11} className="text-text-muted shrink-0" />
            <p className="text-[10px] text-text-muted">
              Add missing keys to your <span className="font-mono">.env.local</span> file and restart the dev server.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default EnvironmentWarningCard;
