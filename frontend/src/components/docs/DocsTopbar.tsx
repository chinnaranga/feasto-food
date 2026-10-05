import React from 'react';
import { BookOpen } from 'lucide-react';
import { DocsSearchBar } from './DocsSearchBar';
import { useDocsBookmarks } from '../../hooks/docs/useDocsBookmarks';
import { buildMetadata } from '../../services/release/buildMetadata';

export const DocsTopbar: React.FC = () => {
  const { bookmarks } = useDocsBookmarks();

  return (
    <header className="h-14 border-b border-border-main bg-primary-bg sticky top-0 z-[9980] px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BookOpen size={16} className="text-brand-orange animate-pulse" />
        <span className="text-xs font-black tracking-tight text-text-primary">
          Feasto Design System <span className="text-[10px] text-text-muted font-normal">v{buildMetadata.version}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <DocsSearchBar />

        {/* Bookmarks Counter */}
        {bookmarks.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-brand-orange bg-brand-orange/5 px-2 py-1 rounded-lg border border-brand-orange/10">
            <span>Bookmarks: {bookmarks.length}</span>
          </div>
        )}
      </div>
    </header>
  );
};
export default DocsTopbar;
