import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import usePortalInventoryStore from '../../store/portalInventoryStore';
import type { StockItem } from '../../store/portalInventoryStore';
import Card from '../../components/ui/Card';

// ─── Visual Stock Meter ──────────────────────────────────────────────────────
export const VisualStockMeter: React.FC<{ item: StockItem }> = ({ item }) => {
  const pct = Math.min(100, Math.round((item.currentQuantity / item.maxStock) * 100));
  
  let color = 'bg-emerald-500';
  let text = 'Healthy';
  let textColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';

  if (item.currentQuantity === 0) {
    color = 'bg-red-600';
    text = 'Out of Stock';
    textColor = 'text-red-700 bg-red-50 border-red-100 animate-pulse';
  } else if (item.currentQuantity <= item.safetyStock) {
    color = 'bg-red-500';
    text = 'Critical Safety';
    textColor = 'text-red-700 bg-red-50 border-red-100';
  } else if (item.currentQuantity <= item.reorderPoint) {
    color = 'bg-amber-500';
    text = 'Reorder Level';
    textColor = 'text-amber-700 bg-amber-50 border-amber-100';
  }

  return (
    <div className="space-y-1.5 w-full select-none text-left">
      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider">
        <span className={`px-1.5 py-0.5 rounded border ${textColor}`}>{text}</span>
        <span className="text-neutral-500">{item.currentQuantity} / {item.maxStock} {item.unit} ({pct}%)</span>
      </div>
      <div className="w-full h-2 rounded-full bg-neutral-100 border border-neutral-200/40 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Main Explorer Component ──────────────────────────────────────────────────
interface InventoryExplorerProps {
  statusFilterPreset?: 'low-stock' | 'out-of-stock' | 'expiry';
}

export const InventoryExplorer: React.FC<InventoryExplorerProps> = ({ statusFilterPreset }) => {
  const navigate = useNavigate();
  const {
    items,
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    adjustStockQuantity,
    deleteIngredient
  } = usePortalInventoryStore();

  const [activeAdjustId, setActiveAdjustId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState<number>(0);

  // Apply filters
  const filteredItems = items.filter((item) => {
    // 1. Status Filter Preset
    if (statusFilterPreset === 'low-stock' && (item.currentQuantity === 0 || item.currentQuantity > item.reorderPoint)) return false;
    if (statusFilterPreset === 'out-of-stock' && item.currentQuantity > 0) return false;
    
    if (statusFilterPreset === 'expiry') {
      if (!item.expiryDate) return false;
      const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (24 * 3600 * 1000));
      if (daysLeft > 7) return false; // not expired or near-expiry
    }

    // 2. Local Filters
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.location !== 'all' && item.location !== filters.location) return false;

    // Expiry category filter
    if (filters.expiryAlert !== 'all') {
      if (!item.expiryDate) return false;
      const elapsed = new Date(item.expiryDate).getTime() - Date.now();
      if (filters.expiryAlert === 'expired' && elapsed >= 0) return false;
      if (filters.expiryAlert === 'near-expiry') {
        const days = Math.ceil(elapsed / (24 * 3600 * 1000));
        if (days < 0 || days > 7) return false;
      }
    }

    // 3. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSupplier = item.supplier.name.toLowerCase().includes(q);
      if (!matchName && !matchSupplier) return false;
    }

    return true;
  });

  const handleAdjustClick = (itemId: string) => {
    setActiveAdjustId(itemId);
    setAdjustValue(0);
  };

  const handleSaveAdjustment = (id: string) => {
    if (adjustValue !== 0) {
      adjustStockQuantity(id, adjustValue, 'Manual adjustment from explorer.');
    }
    setActiveAdjustId(null);
  };

  const getExpiryBadge = (item: StockItem) => {
    if (!item.expiryDate) return <span className="text-neutral-400 font-semibold italic text-[10px]">No Expiry</span>;

    const timeDiff = new Date(item.expiryDate).getTime() - Date.now();
    const daysDiff = Math.ceil(timeDiff / (24 * 3600 * 1000));

    if (daysDiff < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded animate-pulse">
          <AlertCircle size={9} /> Expired
        </span>
      );
    }
    if (daysDiff <= 7) {
      return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
          <AlertTriangle size={9} /> Expiring ({daysDiff}d)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
        Healthy ({daysDiff}d)
      </span>
    );
  };

  // Reorder suggestion summary
  const reorderList = items.filter((i) => i.currentQuantity <= i.reorderPoint);

  return (
    <div className="space-y-5 text-left select-none relative">
      
      {/* Reorder Suggestions Banner */}
      {reorderList.length > 0 && !statusFilterPreset && (
        <div className="bg-neutral-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-neutral-800">
          <div className="flex items-start gap-2.5">
            <Truck size={16} className="text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-neutral-100">Suggested Purchase Reorders</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                There are <strong className="text-white">{reorderList.length} items</strong> below reorder thresholds. Click below to auto-generate vendor order receipts.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/restaurant-portal/inventory/low-stock')}
            className="px-3.5 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer self-start sm:self-center"
          >
            Review Reorders
          </button>
        </div>
      )}

      {/* Explorer filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search stock by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-xl text-xs font-semibold text-neutral-800 transition-all placeholder:text-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-600 cursor-pointer"
          >
            <option value="all">All Stock Types</option>
            <option value="ingredients">Ingredients</option>
            <option value="raw-materials">Raw Materials</option>
            <option value="finished-goods">Finished Goods</option>
            <option value="packaging">Packaging</option>
          </select>

          {/* Location */}
          <select
            value={filters.location}
            onChange={(e) => setFilter('location', e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-600 cursor-pointer"
          >
            <option value="all">All Storage Areas</option>
            <option value="kitchen">Kitchen</option>
            <option value="freezer">Freezer</option>
            <option value="cold-storage">Cold Storage</option>
            <option value="dry-storage">Dry Storage</option>
            <option value="warehouse">Warehouse</option>
            <option value="shelf">Shelf</option>
          </select>

          {/* Expiry alerts filter */}
          <select
            value={filters.expiryAlert}
            onChange={(e) => setFilter('expiryAlert', e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-600 cursor-pointer"
          >
            <option value="all">All Expiries</option>
            <option value="expired">Expired</option>
            <option value="near-expiry">Near Expiry</option>
            <option value="healthy">Healthy</option>
          </select>
        </div>
      </div>

      {/* Explorer Table List */}
      {filteredItems.length > 0 ? (
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200">
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Stock Item</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left font-heading">Type</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left w-64">Stock Status & Progress</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Location</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Expiry</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Preferred Supplier</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col text-left gap-0.5">
                      <span className="text-xs font-bold text-neutral-800">{item.name}</span>
                      {item.recipeMenuIds.length > 0 && (
                        <span className="inline-flex text-[8px] font-bold text-[#e35205] bg-orange-50 px-1 py-0.5 rounded border border-orange-100 self-start">
                          Recipe Linked ({item.recipeMenuIds.length})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-neutral-500 font-semibold uppercase text-left">{item.category}</td>
                  <td className="p-4">
                    <VisualStockMeter item={item} />
                  </td>
                  <td className="p-4">
                    <span className="text-[9px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.location}
                    </span>
                  </td>
                  <td className="p-4 text-left">{getExpiryBadge(item)}</td>
                  <td className="p-4 text-xs text-neutral-500 font-semibold text-left">{item.supplier.name}</td>
                  <td className="p-4">
                    {/* Inline stock adjustment widget overlay */}
                    <div className="flex items-center justify-end gap-1.5">
                      {activeAdjustId === item.id ? (
                        <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-lg p-0.5 animate-slide-up">
                          <button
                            onClick={() => setAdjustValue(adjustValue - 1)}
                            className="p-1 text-neutral-500 hover:text-[#e35205]"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-[10px] font-black text-neutral-800 min-w-8 text-center px-1">
                            {adjustValue >= 0 ? `+${adjustValue}` : adjustValue}
                          </span>
                          <button
                            onClick={() => setAdjustValue(adjustValue + 1)}
                            className="p-1 text-neutral-500 hover:text-[#e35205]"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => handleSaveAdjustment(item.id)}
                            className="px-2 py-1 bg-neutral-800 text-white text-[9px] font-black uppercase rounded-md hover:bg-neutral-900"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAdjustClick(item.id)}
                            className="px-2 py-1 border border-neutral-200 hover:bg-neutral-50 text-[9px] font-black uppercase tracking-wider text-neutral-600 rounded-lg transition-colors cursor-pointer"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => navigate(`/restaurant-portal/inventory/${item.id}`)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteIngredient(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/30">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
            <AlertCircle size={16} />
          </div>
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            No stock items found
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            We couldn't find any stock ingredients matching your search query or filter tags. Click reset to clear.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-[10px] font-black uppercase tracking-wider text-neutral-600 rounded-xl transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Expiry Risk Alert footer info */}
      <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Supply Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            AI predicts that oolong milk tea consumption will surge by 15% this weekend due to local forecast patterns. We suggest keeping "Matcha Powder" reorders above safety thresholds.
          </p>
        </div>
      </div>

    </div>
  );
};

export default InventoryExplorer;
