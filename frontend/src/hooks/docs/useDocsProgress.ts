import { useEffect } from 'react';
import { useDocsStore } from '../../store/docs/docsStore';

export const useDocsProgress = (containerRef: React.RefObject<HTMLElement | null>) => {
  const progress = useDocsStore((state) => state.readingProgress);
  const setReadingProgress = useDocsStore((state) => state.setReadingProgress);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      
      if (scrollHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const ratio = Math.round((scrollTop / scrollHeight) * 100);
      setReadingProgress(ratio);
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, setReadingProgress]);

  return progress;
};
export default useDocsProgress;
