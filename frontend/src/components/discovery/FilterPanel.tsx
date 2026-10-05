import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { CUISINES } from '@/data/restaurants';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

interface FilterPanelProps {
  onClose?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const trackEvent = useTrackEvent();
  const { searchQuery, filters, setFilters, resetFilters } = useDiscoveryStore();

  const toggleCuisine = (c: string) => {
    const updated = filters.cuisine.includes(c)
      ? filters.cuisine.filter((x) => x !== c)
      : [...filters.cuisine, c];
    setFilters({ cuisine: updated });
    trackEvent('search_submit', { queryText: searchQuery, filterState: { ...filters, cuisine: updated }, category: 'cuisine_toggle' });
  };

  const booleanFilter = (key: keyof typeof filters) => (
    <button
      onClick={() => {
        const nextVal = !filters[key];
        setFilters({ [key]: nextVal });
        trackEvent('search_submit', { queryText: searchQuery, filterState: { ...filters, [key]: nextVal }, category: 'filter_toggle_' + key });
      }}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-main cursor-pointer
        ${filters[key]
          ? 'bg-brand-orange text-white border-brand-orange'
          : 'bg-primary-bg text-text-secondary border-border-main hover:border-[#cbd5e1]'
        }`}
    >
      {key === 'hasOffers' ? 'Has Offers' :
       key === 'vegetarian' ? '🥦 Vegetarian' :
       key === 'vegan' ? '🌱 Vegan' :
       key === 'healthy' ? '💚 Healthy' :
       key === 'spicy' ? '🌶 Spicy' :
       key === 'openNow' ? '🟢 Open Now' :
       key === 'highProtein' ? '💪 High Protein' :
       key === 'favoritesOnly' ? '❤️ Favorites' : key}
    </button>
  );

  const activeCount = [
    filters.cuisine.length > 0,
    filters.priceRange !== 'all',
    filters.minRating > 0,
    filters.maxDeliveryTime < 60,
    filters.hasOffers,
    filters.vegetarian,
    filters.vegan,
    filters.healthy,
    filters.spicy,
    filters.openNow,
    filters.highProtein,
    filters.favoritesOnly,
  ].filter(Boolean).length;

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl shadow-medium p-6 flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-orange" />
          <h3 className="text-sm font-bold text-text-primary">Filters</h3>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 bg-brand-orange text-white text-[10px] font-extrabold rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-brand-orange hover:text-[#c94804] transition-main cursor-pointer"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-main cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-3">Cuisine</p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => toggleCuisine(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-main cursor-pointer
                ${filters.cuisine.includes(c)
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-primary-bg text-text-secondary border-border-main hover:border-[#cbd5e1]'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-3">Price Range</p>
        <div className="flex gap-2">
          {(['all', 'budget', 'mid', 'premium'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ priceRange: p })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-main cursor-pointer capitalize
                ${filters.priceRange === p
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-primary-bg text-text-secondary border-border-main hover:border-[#cbd5e1]'
                }`}
            >
              {p === 'all' ? 'All' : p === 'budget' ? '₹ Budget' : p === 'mid' ? '₹₹ Mid' : '₹₹₹ Premium'}
            </button>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-3">
          Min Rating: <span className="text-text-primary">{filters.minRating > 0 ? `${filters.minRating}★` : 'Any'}</span>
        </p>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(e) => setFilters({ minRating: parseFloat(e.target.value) })}
          onMouseUp={() => trackEvent('search_submit', { queryText: searchQuery, filterState: filters, category: 'min_rating_slider' })}
          className="w-full h-1 accent-brand-orange cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>Any</span><span>5★</span>
        </div>
      </div>

      {/* Max Delivery Time */}
      <div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-3">
          Max Delivery Time: <span className="text-text-primary">{filters.maxDeliveryTime} min</span>
        </p>
        <input
          type="range"
          min={10}
          max={60}
          step={5}
          value={filters.maxDeliveryTime}
          onChange={(e) => setFilters({ maxDeliveryTime: parseInt(e.target.value) })}
          onMouseUp={() => trackEvent('search_submit', { queryText: searchQuery, filterState: filters, category: 'max_delivery_time_slider' })}
          className="w-full h-1 accent-brand-orange cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>10 min</span><span>60 min</span>
        </div>
      </div>

      {/* Tag Filters */}
      <div>
        <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mb-3">Preferences</p>
        <div className="flex flex-wrap gap-2">
          {booleanFilter('hasOffers')}
          {booleanFilter('vegetarian')}
          {booleanFilter('vegan')}
          {booleanFilter('healthy')}
          {booleanFilter('spicy')}
          {booleanFilter('openNow')}
          {booleanFilter('highProtein')}
          {booleanFilter('favoritesOnly')}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
