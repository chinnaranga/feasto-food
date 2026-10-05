import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { useDocsSearch } from '../../hooks/docs/useDocsSearch';
import { useDocsStore } from '../../store/docs/docsStore';

export const DocsSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, results } = useDocsSearch();
  const setActivePageId = useDocsStore((state) => state.setActivePageId);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close search results dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectResult = (pageId: string) => {
    setActivePageId(pageId);
    setSearchQuery('');
    setFocused(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs z-[9985]">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search design docs..."
          className="w-full pl-9 pr-8 py-1.5 bg-secondary-bg hover:bg-surface-bg border border-border-main focus:border-brand-orange focus:bg-white text-xs rounded-xl transition-main placeholder:text-text-muted text-text-primary focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-secondary-bg text-text-muted hover:text-text-primary transition-main cursor-pointer"
          >
            <X size={10} />
          </button>
        )}
      </div>

      {focused && searchQuery && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-main rounded-xl shadow-medium max-h-60 overflow-y-auto scrollbar-thin flex flex-col p-1.5">
          {results.map((res) => (
            <button
              key={res.pageId}
              onClick={() => handleSelectResult(res.pageId)}
              className="w-full flex items-center justify-between text-left p-2 hover:bg-surface-bg rounded-lg transition-main cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block mb-0.5">
                  {res.category}
                </span>
                <span className="text-xs font-bold text-text-primary block truncate">
                  {res.title}
                </span>
              </div>
              <ChevronRight size={12} className="text-text-muted shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default DocsSearchBar;
