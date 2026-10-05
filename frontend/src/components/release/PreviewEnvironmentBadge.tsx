import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useReleaseChannel } from '../../hooks/release/useReleaseChannel';
import { useBuildMetadata } from '../../hooks/release/useBuildMetadata';

export const PreviewEnvironmentBadge: React.FC = () => {
  const { isPreview, isStaging, isDevelopment } = useReleaseChannel();
  const { version } = useBuildMetadata();

  if (!isPreview && !isStaging && !isDevelopment) return null;

  const label = isPreview ? 'Preview' : isStaging ? 'Staging' : 'Dev';
  const colorClass = isPreview
    ? 'bg-violet-500/10 border-violet-500/30 text-violet-500'
    : isStaging
    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
    : 'bg-sky-500/10 border-sky-500/30 text-sky-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-4 right-4 z-[9985] flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-md ${colorClass}`}
        role="status"
        aria-label={`Running in ${label} environment`}
      >
        <Eye size={10} className="shrink-0" />
        <span>{label} · v{version}</span>
      </motion.div>
    </AnimatePresence>
  );
};
export default PreviewEnvironmentBadge;
