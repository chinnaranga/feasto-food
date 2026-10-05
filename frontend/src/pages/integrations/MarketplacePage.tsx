import React from 'react';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { MarketplaceCard, IntegrationsEmptyState } from './IntegrationsComponents';

export const MarketplacePage: React.FC = () => {
  const { marketplaceApps, installMarketplaceApp } = usePortalIntegrationsStore();
  const [search, setSearch] = React.useState('');

  const filteredApps = marketplaceApps.filter(
    (app) =>
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.tagline.toLowerCase().includes(search.toLowerCase()) ||
      app.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              🛒 Enterprise App Marketplace
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Feasto App Store & Verified Third-Party Integrations
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Discover verified apps for retail POS hardware, automated email marketing, customer support desk ticketing, and financial inventory sync.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marketplace apps..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Marketplace Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <MarketplaceCard key={app.id} app={app} onInstall={installMarketplaceApp} />
          ))}
        </div>
      ) : (
        <IntegrationsEmptyState
          title="No Marketplace Apps Found"
          description="No third-party apps match your search query."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
