import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (val: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search settings, orders...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-[#f7f8fa] hover:bg-neutral-100/70 border border-neutral-200 focus:border-[#e35205] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e35205]/10 rounded-lg text-xs text-neutral-800 transition-all duration-200 placeholder:text-neutral-400"
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-neutral-600 transition-main cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
export default SearchInput;
