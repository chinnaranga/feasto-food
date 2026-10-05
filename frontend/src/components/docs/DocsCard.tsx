import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DocsPage } from '../../types/docs';
import { useDocsStore } from '../../store/docs/docsStore';

interface DocsCardProps {
  page: DocsPage;
}

export const DocsCard: React.FC<DocsCardProps> = ({ page }) => {
  const setActivePageId = useDocsStore((state) => state.setActivePageId);

  return (
    <div
      onClick={() => setActivePageId(page.id)}
      className="p-5 border border-border-main hover:border-brand-orange/20 bg-primary-bg hover:bg-brand-orange/[0.005] rounded-2xl shadow-xs hover:shadow-sm transition-main cursor-pointer flex flex-col justify-between text-left h-36"
    >
      <div>
        <h4 className="text-xs font-black text-text-primary tracking-tight mb-1 truncate">
          {page.title}
        </h4>
        <p className="text-[11px] text-text-secondary leading-normal line-clamp-2">
          {page.summary}
        </p>
      </div>

      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-orange uppercase tracking-wider mt-4">
        <span>View Guide</span>
        <ArrowRight size={10} />
      </div>
    </div>
  );
};
export default DocsCard;
