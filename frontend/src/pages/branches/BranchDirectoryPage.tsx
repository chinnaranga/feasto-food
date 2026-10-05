import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sliders, LayoutGrid, List } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { BranchCard, BranchTable, BranchEmptyState } from './BranchComponents';

export const BranchDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    branches,
    readinessScores,
    searchQuery,
    regionFilter,
    statusFilter,
    setSearchQuery,
    setRegionFilter,
    setStatusFilter,
    setSelectedBranchId,
    toggleBranchStatus,
  } = usePortalBranchesStore();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const regions = [
    { label: 'All Regions', value: 'all' },
    { label: 'Maharashtra West', value: 'Maharashtra West' },
    { label: 'Delhi NCR', value: 'Delhi NCR' },
    { label: 'Karnataka South', value: 'Karnataka South' },
    { label: 'Telangana Central', value: 'Telangana Central' },
  ];

  const statuses = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Needs Review', value: 'review_needed' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const filteredBranches = branches.filter((b) => {
    const matchesRegion = regionFilter === 'all' || b.region === regionFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.managerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  const handleSelect = (id: string) => {
    setSelectedBranchId(id);
    navigate(`/restaurant/branches/${id}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branch code, name, city, or manager..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 font-sans"
          />
        </div>

        {/* Region & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 focus:outline-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
              title="Table View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Directory View */}
      {filteredBranches.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBranches.map((b) => (
              <BranchCard
                key={b.id}
                branch={b}
                readinessPct={readinessScores[b.id]?.overallReadinessPct}
                onSelect={handleSelect}
                onToggleStatus={toggleBranchStatus}
              />
            ))}
          </div>
        ) : (
          <BranchTable
            branches={filteredBranches}
            readinessMap={readinessScores}
            onSelect={handleSelect}
          />
        )
      ) : (
        <BranchEmptyState
          title="No Outlets Match Criteria"
          description="No restaurant branch matches your search term or filter selection."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setRegionFilter('all');
            setStatusFilter('all');
          }}
        />
      )}
    </div>
  );
};

export default BranchDirectoryPage;
