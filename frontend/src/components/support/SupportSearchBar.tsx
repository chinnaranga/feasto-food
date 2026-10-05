import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useSupportStore } from '@/store/supportStore';

export const SupportSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSupportStore();

  const suggestions = [
    'Where is my order?',
    'How do I cancel?',
    'Refund status',
    'Update my address',
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-orange transition-main">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help articles, FAQs, and common order issues..."
          className="w-full pl-12 pr-4 py-4 bg-primary-bg border border-border-main focus:border-brand-orange/40 focus:ring-4 focus:ring-brand-orange/5 hover:border-[#cbd5e1] rounded-2xl text-base text-text-primary placeholder:text-text-muted transition-main focus:outline-none shadow-soft"
        />
      </div>

      {/* AI Suggestion Prompts */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand-orange uppercase tracking-wider select-none">
          <Sparkles size={11} className="animate-pulse" />
          <span>Ask AI Helper:</span>
        </div>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setSearchQuery(s)}
            className="px-3 py-1.5 bg-secondary-bg hover:bg-brand-orange/5 border border-border-main hover:border-brand-orange/15 hover:text-brand-orange rounded-xl text-xs font-bold text-text-secondary transition-main cursor-pointer"
          >
            "{s}"
          </button>
        ))}
      </div>
    </div>
  );
};
