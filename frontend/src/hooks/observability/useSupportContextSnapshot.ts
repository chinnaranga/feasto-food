import { useState, useCallback } from 'react';
import { createSupportSnapshot, copySnapshotToClipboard } from '../../services/observability/supportSnapshot';

export const useSupportContextSnapshot = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    const success = await copySnapshotToClipboard();
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
    return success;
  }, []);

  return {
    isCopied,
    getSnapshot: createSupportSnapshot,
    copyToClipboard,
  };
};
export default useSupportContextSnapshot;
