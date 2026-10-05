import React from 'react';
import { useDocsStore } from '../../store/docs/docsStore';

export const ReadingProgressBar: React.FC = () => {
  const progress = useDocsStore((state) => state.readingProgress);

  return (
    <div className="fixed top-14 left-0 right-0 h-0.5 bg-border-main z-[9975] pointer-events-none">
      <div
        className="h-full bg-brand-orange transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
export default ReadingProgressBar;
