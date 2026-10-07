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
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8D98]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#141518]/20 focus:border-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] text-xs font-mono font-medium text-[#141518] transition-all duration-150 placeholder:text-[#8A8D98]"
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8A8D98] hover:text-[#141518] transition-colors cursor-pointer"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
export default SearchInput;
