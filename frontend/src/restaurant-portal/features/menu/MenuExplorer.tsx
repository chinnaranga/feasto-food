import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Plus,
  ArrowDown,
  GripVertical,
  Check,
  X,
  AlertCircle,
  Sliders,
  DollarSign
} from 'lucide-react';
import usePortalMenuStore, { MenuItem } from '../../store/portalMenuStore';
import { PublishDialog, DeleteDialog, DuplicateDialog } from '../../components/menu/MenuDialogs';

export interface MenuExplorerProps {
  statusFilterPreset?: string;
}

export const MenuExplorer: React.FC<MenuExplorerProps> = ({ statusFilterPreset }) => {
  const navigate = useNavigate();
  const {
    items,
    categories,
    filters,
    setFilter,
    searchQuery,
    setSearchQuery,
    clearFilters,
    updateMenuItem,
    deleteMenuItem,
    duplicateMenuItem
  } = usePortalMenuStore();

  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Dialog states
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [activeModal, setActiveModal] = useState<'publish' | 'delete' | 'duplicate' | null>(null);

  // Group items by category to create spatial Canvas sections
  const filteredItems = items.filter((item) => {
    if (statusFilterPreset && item.status !== statusFilterPreset) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.dietary !== 'all' && item.dietary !== filters.dietary) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoriesInCanvas = Array.from(new Set(filteredItems.map((i) => i.category)));

  const handlePriceSave = (itemId: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      updateMenuItem(itemId, { basePrice: val });
    }
    setEditingPriceId(null);
  };

  const toggleAvailability = (item: MenuItem) => {
    const newStatus = item.status === 'published' ? 'archived' : 'published';
    updateMenuItem(item.id, { status: newStatus });
  };

  return (
    <div className="space-y-8 text-left select-none relative">
      
      {/* ── MENU CANVAS TOP CONTROLS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#141518]/15">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#1B3BFF] block">
            RESTAURANT STUDIO · DIRECT MANIPULATION
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#141518] tracking-tight uppercase mt-1">
            MENU CANVAS
          </h1>
          <p className="font-mono text-xs text-[#70727D] mt-1">
            Reorder sections, adjust live prices, and toggle kitchen availability directly on the canvas.
          </p>
        </div>

        {/* Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#70727D]" />
            <input
              type="text"
              placeholder="Search dishes or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#141518]/20 focus:border-[#1B3BFF] focus:outline-none text-xs font-mono text-[#141518] placeholder:text-[#A0A2AA]"
            />
          </div>

          <select
            value={filters.dietary}
            onChange={(e) => setFilter('dietary', e.target.value)}
            className="px-3 py-2 bg-white border border-[#141518]/20 text-xs font-mono uppercase tracking-wider text-[#141518] cursor-pointer focus:outline-none focus:border-[#1B3BFF]"
          >
            <option value="all">ALL DIET</option>
            <option value="veg">VEG ONLY</option>
            <option value="non-veg">NON-VEG</option>
            <option value="vegan">VEGAN</option>
          </select>

          <button
            onClick={() => navigate('/portal/menu/editor')}
            className="px-4 py-2 bg-[#141518] text-[#F3F0E8] hover:bg-[#1B3BFF] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus size={14} />
            <span>NEW DISH OBJECT +</span>
          </button>
        </div>
      </div>

      {/* ── SPATIAL MENU CANVAS (SECTIONS & DIRECT MANIPULATION OBJECTS) ── */}
      {categoriesInCanvas.length > 0 ? (
        <div className="space-y-12">
          {categoriesInCanvas.map((category, catIdx) => {
            const sectionItems = filteredItems.filter((i) => i.category === category);

            return (
              <section key={category} className="space-y-4">
                
                {/* Category Header with Flow Indicator */}
                <div className="flex items-center justify-between border-b-2 border-[#141518] pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-[#1B3BFF]">
                      0{catIdx + 1}
                    </span>
                    <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                      {category}
                    </h2>
                    <span className="font-mono text-xs text-[#70727D]">
                      ({sectionItems.length} OBJECTS)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[#70727D]">
                    <span>DISPATCH FLOW</span>
                    <ArrowDown size={14} className="text-[#1B3BFF]" />
                  </div>
                </div>

                {/* Grid of Direct Manipulation Food Objects */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {sectionItems.map((item) => {
                    const isAvailable = item.status === 'published';

                    return (
                      <div
                        key={item.id}
                        className={`group relative bg-white border ${
                          isAvailable ? 'border-[#141518]/20' : 'border-red-300 bg-red-50/20 opacity-80'
                        } p-5 flex flex-col justify-between transition-all hover:border-[#141518] hover:shadow-sm`}
                      >
                        {/* Drag Handle & Status Indicator */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase">
                            <span
                              className={`w-2 h-2 ${
                                isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <span className={isAvailable ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                              {isAvailable ? 'AVAILABLE IN KITCHEN' : 'SOLD OUT'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setPreviewItem(item)}
                              className="p-1 text-[#70727D] hover:text-[#1B3BFF] cursor-pointer"
                              title="Live Customer Canvas Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setModalItem(item);
                                setActiveModal('duplicate');
                              }}
                              className="p-1 text-[#70727D] hover:text-[#141518] cursor-pointer"
                              title="Duplicate Object"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setModalItem(item);
                                setActiveModal('delete');
                              }}
                              className="p-1 text-[#70727D] hover:text-red-600 cursor-pointer"
                              title="Remove Dish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1 mb-4">
                          <h3 className="font-heading font-black text-lg text-[#141518] leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#52545E] line-clamp-2 leading-relaxed">
                            {item.description || 'Traditional recipe prepared fresh upon dispatch.'}
                          </p>
                        </div>

                        {/* Add-ons Visual Hierarchy (Section 20: Biryani -> Dishes -> Add-ons) */}
                        <div className="bg-[#F8F7F3] p-2.5 border border-[#141518]/10 text-left font-mono text-[11px] mb-4 space-y-1">
                          <span className="text-[9px] uppercase tracking-widest text-[#70727D] block">
                            LINKED ADD-ONS
                          </span>
                          <div className="flex flex-wrap gap-2 text-[#141518]">
                            <span className="bg-white px-2 py-0.5 border border-[#141518]/10">
                              + Extra Salan (₹40)
                            </span>
                            <span className="bg-white px-2 py-0.5 border border-[#141518]/10">
                              + Double Raita (₹30)
                            </span>
                          </div>
                        </div>

                        {/* Direct Manipulation Controls: Price Editing & Availability Toggle */}
                        <div className="pt-3 border-t border-[#141518]/10 flex items-center justify-between font-mono">
                          
                          {/* Price Direct Edit */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#70727D] uppercase">PRICE:</span>
                            {editingPriceId === item.id ? (
                              <div className="flex items-center gap-1">
                                <span className="font-bold">₹</span>
                                <input
                                  type="number"
                                  autoFocus
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(e.target.value)}
                                  className="w-16 px-1 py-0.5 border border-[#1B3BFF] text-xs font-bold font-mono focus:outline-none"
                                />
                                <button
                                  onClick={() => handlePriceSave(item.id)}
                                  className="p-1 bg-[#141518] text-white hover:bg-emerald-600 cursor-pointer"
                                >
                                  <Check size={12} />
                                </button>
                                <button
                                  onClick={() => setEditingPriceId(null)}
                                  className="p-1 border border-[#141518]/20 hover:bg-gray-100 cursor-pointer"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setTempPrice(String(item.basePrice));
                                }}
                                className="group/price flex items-center gap-1 font-black text-sm text-[#141518] hover:text-[#1B3BFF] cursor-pointer"
                                title="Click to adjust price"
                              >
                                <span>₹{item.basePrice}</span>
                                <Edit2 size={10} className="opacity-0 group-hover/price:opacity-100 text-[#1B3BFF]" />
                              </button>
                            )}
                          </div>

                          {/* Direct Availability Switch */}
                          <button
                            onClick={() => toggleAvailability(item)}
                            className={`px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer border transition-colors ${
                              isAvailable
                                ? 'bg-[#141518] text-white hover:bg-red-700'
                                : 'bg-[#D7F04A] text-[#141518] border-[#141518] hover:bg-[#c6df3d]'
                            }`}
                          >
                            {isAvailable ? 'MARK SOLD OUT' : 'ACTIVATE'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center font-mono text-xs text-[#70727D] border border-dashed border-[#141518]/20">
          <p className="uppercase tracking-wider">NO FOOD OBJECTS MATCH QUERY</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 border border-[#141518] font-bold text-xs uppercase hover:bg-[#141518] hover:text-white cursor-pointer"
          >
            RESET CANVAS FILTERS
          </button>
        </div>
      )}

      {/* ── CUSTOMER CANVAS LIVE PREVIEW DRAWER ── */}
      {previewItem && (
        <div className="fixed inset-0 z-[9990] flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setPreviewItem(null)}
          />
          <div className="relative w-full max-w-md bg-[#F3F0E8] border-l border-[#141518] h-full shadow-2xl flex flex-col justify-between p-8 z-[9995] text-left overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#141518] pb-3">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#1B3BFF]">
                  FEASTO CANVAS · LIVE CUSTOMER VIEW
                </span>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="font-mono text-xs text-[#70727D] hover:text-black cursor-pointer uppercase"
                >
                  CLOSE [X]
                </button>
              </div>

              {/* Dish Visual Preview */}
              <div className="aspect-[4/3] w-full bg-[#141518] text-white flex items-center justify-center p-4 relative overflow-hidden">
                <img
                  src={previewItem.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop'}
                  alt={previewItem.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#D7F04A] text-[#141518] font-mono text-[10px] font-black uppercase px-2 py-0.5">
                  ₹{previewItem.basePrice}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                  {previewItem.name}
                </h3>
                <p className="text-xs text-[#52545E] leading-relaxed">
                  {previewItem.description || 'Authentic slow-simmered spices, regional grain, and signature aromatic profile.'}
                </p>
              </div>

              <div className="font-mono text-xs border-t border-[#141518]/20 pt-4 space-y-2 text-[#70727D]">
                <div>DIETARY: <span className="text-[#141518] font-bold uppercase">{previewItem.dietary}</span></div>
                <div>CATEGORY: <span className="text-[#141518] font-bold uppercase">{previewItem.category}</span></div>
                <div>EST. PREPARATION: <span className="text-[#141518] font-bold">18-22 MIN</span></div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#141518]">
              <button
                onClick={() => setPreviewItem(null)}
                className="w-full py-4 bg-[#141518] text-[#F3F0E8] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#1B3BFF] cursor-pointer"
              >
                RETURN TO MENU CANVAS →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <PublishDialog
        isOpen={activeModal === 'publish'}
        itemName={modalItem?.name || ''}
        onConfirm={() => {
          if (modalItem) updateMenuItem(modalItem.id, { status: 'published' });
          setActiveModal(null);
        }}
        onCancel={() => setActiveModal(null)}
      />
      <DeleteDialog
        isOpen={activeModal === 'delete'}
        itemName={modalItem?.name || ''}
        onConfirm={() => {
          if (modalItem) deleteMenuItem(modalItem.id);
          setActiveModal(null);
        }}
        onCancel={() => setActiveModal(null)}
      />
      <DuplicateDialog
        isOpen={activeModal === 'duplicate'}
        itemName={modalItem?.name || ''}
        onConfirm={() => {
          if (modalItem) duplicateMenuItem(modalItem.id);
          setActiveModal(null);
        }}
        onCancel={() => setActiveModal(null)}
      />

    </div>
  );
};

export default MenuExplorer;
