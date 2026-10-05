import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { analytics } from '@/services/analytics/analyticsClient';

const AI_SUGGESTIONS = [
  'What should I eat tonight?',
  'Healthy lunch under ₹400',
  'Best pizza for date night',
  'Cheap biryani near me',
  'High protein post-workout meal',
  'Late-night food nearby',
  'Vegan options close by',
  'Quick delivery under 20 mins',
];

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search cuisine, dish, or ask AI...',
  onSearch,
  className = '',
}) => {
  const { searchQuery, setSearchQuery } = useDiscoveryStore();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = AI_SUGGESTIONS.filter(
    (s) => !localValue || s.toLowerCase().includes(localValue.toLowerCase())
  ).slice(0, 5);

  const showSuggestions = isFocused && filteredSuggestions.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (value: string) => {
    setSearchQuery(value);
    setLocalValue(value);
    setIsFocused(false);
    onSearch?.(value);
    inputRef.current?.blur();
    
    if (value.trim()) {
      analytics.trackEvent('search_submit', { queryText: value, category: 'search_bar' });
    }
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(localValue); }}
        className={`flex items-center gap-2 px-4 py-3 bg-primary-bg border rounded-2xl transition-main shadow-soft
          ${isFocused ? 'border-brand-orange/40 shadow-medium ring-2 ring-brand-orange/10' : 'border-border-main hover:border-[#cbd5e1]'}`}
      >
        <Search size={16} className="text-text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        {localValue && (
          <button type="button" onClick={handleClear} className="text-text-muted hover:text-text-primary transition-main cursor-pointer">
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          className="px-3 py-1.5 bg-brand-orange hover:bg-[#c94804] text-white text-xs font-bold rounded-xl transition-main cursor-pointer shrink-0"
        >
          Ask AI
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-primary-bg border border-border-main rounded-2xl shadow-modal z-50 overflow-hidden">
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <Sparkles size={12} className="text-brand-orange animate-pulse" />
            <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest">
              AI Suggestions
            </span>
          </div>
          {filteredSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSubmit(suggestion)}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-secondary-bg hover:text-text-primary transition-main cursor-pointer flex items-center gap-3"
            >
              <Search size={13} className="text-text-muted shrink-0" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
