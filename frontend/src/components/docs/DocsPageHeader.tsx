import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { DocsPage } from '../../types/docs';
import { useDocsBookmarks } from '../../hooks/docs/useDocsBookmarks';

interface DocsPageHeaderProps {
  page: DocsPage;
}

export const DocsPageHeader: React.FC<DocsPageHeaderProps> = ({ page }) => {
  const { isBookmarked, toggleBookmark } = useDocsBookmarks();
  const marked = isBookmarked(page.id);

  return (
    <div className="border-b border-border-main/60 pb-6 text-left">
      <div className="flex items-center justify-between gap-4">
        {/* Category tag */}
        <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange bg-brand-orange/5 border border-brand-orange/10 px-2 py-0.5 rounded-md">
          {page.category}
        </span>

        {/* Bookmark action */}
        <button
          onClick={() => toggleBookmark(page.id)}
          className={`p-1.5 rounded-lg border transition-main cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
            marked
              ? 'bg-brand-orange/5 border-brand-orange/20 text-brand-orange'
              : 'bg-white border-border-main text-text-secondary hover:text-text-primary'
          }`}
          aria-label={marked ? 'Remove bookmark' : 'Bookmark this page'}
        >
          {marked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
          <span>{marked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
      </div>

      <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-text-primary mt-3.5 mb-1.5">
        {page.title}
      </h1>
      
      <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
        {page.summary}
      </p>
    </div>
  );
};
export default DocsPageHeader;
