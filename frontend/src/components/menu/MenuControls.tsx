import React from 'react';
import { Search, X } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';

export const MenuSearchBar: React.FC = () => {
  const { menuSearchQuery, setMenuSearchQuery } = useMenuStore();
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#101218] border border-[#1F2232] hover:border-[#25293A] focus-within:border-[#6D5EF5] focus-within:ring-1 focus-within:ring-[#6D5EF5] rounded-xl transition-all">
      <Search size={14} className="text-[#6F7480] shrink-0" />
      <input
        type="text"
        value={menuSearchQuery}
        onChange={(e) => setMenuSearchQuery(e.target.value)}
        placeholder="Search dishes…"
        className="flex-1 bg-transparent text-sm text-[#F4F5F7] placeholder-[#6F7480] focus:outline-none"
      />
      {menuSearchQuery && (
        <button onClick={() => setMenuSearchQuery('')} className="text-[#6F7480] hover:text-[#F4F5F7] transition-all cursor-pointer">
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export const MenuFilterChips: React.FC = () => {
  const { activeMenuFilters, toggleMenuFilter, clearMenuFilters } = useMenuStore();

  const FILTERS = [
    { id: 'Vegetarian', label: '🥦 Veg' },
    { id: 'Vegan', label: '🌱 Vegan' },
    { id: 'Gluten Free', label: 'GF' },
    { id: 'High Protein', label: '💪 Protein' },
    { id: 'Healthy', label: '💚 Healthy' },
    { id: 'Popular', label: '🔥 Popular' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((f) => {
        const isActive = activeMenuFilters.includes(f.id);
        return (
          <button
            key={f.id}
            onClick={() => toggleMenuFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer
              ${isActive
                ? 'bg-[#6D5EF5] text-white border-[#6D5EF5] shadow-xs'
                : 'bg-[#101218] text-[#A7ACB8] border-[#1F2232] hover:border-[#25293A] hover:text-[#F4F5F7]'
              }`}
          >
            {f.label}
          </button>
        );
      })}
      {activeMenuFilters.length > 0 && (
        <button
          onClick={clearMenuFilters}
          className="px-3 py-1.5 rounded-xl border border-[#1F2232] text-[11px] font-bold text-[#6F7480] hover:text-[#F4F5F7] transition-all cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default MenuSearchBar;
