import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '@/store/discoveryStore';
import { useDiscoveryStore } from '@/store/discoveryStore';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'delivery_time', label: 'Fastest Delivery' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export const SortDropdown: React.FC = () => {
  const { sortOption, setSortOption } = useDiscoveryStore();

  return (
    <div className="relative">
      <label htmlFor="sort-select" className="sr-only">Sort restaurants</label>
      <div className="relative">
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="appearance-none pl-3 pr-8 py-2 text-xs font-bold text-text-primary bg-primary-bg border border-border-main hover:border-[#cbd5e1] rounded-xl transition-main cursor-pointer focus-ring focus-visible:outline-brand-orange"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
};

export { SORT_OPTIONS };
export type { SortOption };
export default SortDropdown;
