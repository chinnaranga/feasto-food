import React from 'react';
import { Search } from 'lucide-react';

export interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2.5 px-3.5 py-1.5 bg-secondary-bg hover:bg-surface-bg/85 border border-border-main hover:border-[#cbd5e1] text-text-muted hover:text-text-secondary rounded-xl transition-main cursor-pointer focus-ring text-left w-full max-w-[240px] md:max-w-[280px] ${className}`}
    >
      <Search size={16} className="text-text-muted group-hover:text-text-secondary transition-main shrink-0" />
      <span className="flex-1 text-xs font-medium truncate select-none">
        Search food, cuisines...
      </span>
      <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-text-muted bg-primary-bg border border-border-main rounded-md select-none shrink-0 font-sans shadow-xs">
        <span>⌘</span>K
      </kbd>
    </button>
  );
};
