import React from 'react';
import { Sliders, Search, Plus } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { AppCard, IntegrationsEmptyState } from './IntegrationsComponents';
import type { AppCategory } from '../../types/integrations';

export const AppConnectionsPage: React.FC = () => {
  const {
    connectors,
    searchQuery,
    categoryFilter,
    setSearchQuery,
    setCategoryFilter,
    toggleConnectorStatus,
  } = usePortalIntegrationsStore();

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Payments', value: 'payment' },
    { label: 'Delivery Express', value: 'delivery' },
    { label: 'POS Terminals', value: 'pos' },
    { label: 'Messaging & SMS', value: 'messaging' },
    { label: 'Accounting ERP', value: 'accounting' },
    { label: 'Hardware Printers', value: 'printer' },
    { label: 'CRM & Guests', value: 'crm' },
  ];

  const filteredConnectors = connectors.filter((c) => {
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search third-party app connectors..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 font-sans"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat.value
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Connectors Grid */}
      {filteredConnectors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnectors.map((c) => (
            <AppCard key={c.id} connector={c} onToggleStatus={toggleConnectorStatus} />
          ))}
        </div>
      ) : (
        <IntegrationsEmptyState
          title="No App Connectors Found"
          description="No third-party application matching your search or category filter criteria."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
          }}
        />
      )}
    </div>
  );
};

export default AppConnectionsPage;
