import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useDeploymentStatus } from '../../hooks/release/useDeploymentStatus';
import { useReleaseChannel } from '../../hooks/release/useReleaseChannel';

export const ReleaseStatusBanner: React.FC = () => {
  const { score } = useDeploymentStatus();
  const { isDevelopment } = useReleaseChannel();

  // Only render in development mode
  if (!isDevelopment) return null;

  const icon =
    score >= 80 ? (
      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
    ) : score >= 50 ? (
      <AlertTriangle size={14} className="text-amber-500 shrink-0" />
    ) : (
      <XCircle size={14} className="text-red-500 shrink-0" />
    );

  const message =
    score >= 80
      ? `Deployment score: ${score}% — All systems operational.`
      : score >= 50
      ? `Deployment score: ${score}% — Some checks need attention.`
      : `Deployment score: ${score}% — Critical issues detected. Review checklist.`;

  const borderColor =
    score >= 80 ? 'border-emerald-500/30 bg-emerald-500/5' : score >= 50 ? 'border-amber-500/30 bg-amber-500/5' : 'border-red-500/30 bg-red-500/5';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-[9980] flex items-center justify-center gap-2 px-4 py-1.5 border-b text-xs font-semibold ${borderColor}`}
        role="status"
      >
        {icon}
        <span className="text-text-secondary">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};
export default ReleaseStatusBanner;
