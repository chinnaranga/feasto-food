import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag, Sparkles, CheckSquare, Square, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import usePortalCategoryStore from '../../store/portalCategoryStore';
import usePortalMenuStore from '../../store/portalMenuStore';
import Card from '../../components/ui/Card';

// ─── Section assignment panel detail page ─────────────────────────────────────
export const SectionDetailPanel: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { sections, assignItemsToSection, updateSection } = usePortalCategoryStore();
  const { items } = usePortalMenuStore();

  const section = sections.find((s) => s.id === id);
  const [selectedIds, setSelectedIds] = useState<string[]>(section?.itemIds || []);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center select-none">
        <AlertCircle size={20} className="text-red-500 mb-2" />
        <h4 className="text-xs font-bold text-neutral-800 uppercase">Section Not Found</h4>
        <button onClick={() => navigate('/restaurant-portal/menu/sections')} className="text-xs text-[#e35205] mt-2 cursor-pointer font-bold">
          Go back to list
        </button>
      </div>
    );
  }

  const handleToggleItem = (itemId: string) => {
    if (selectedIds.includes(itemId)) {
      setSelectedIds(selectedIds.filter((x) => x !== itemId));
    } else {
      setSelectedIds([...selectedIds, itemId]);
    }
  };

  const handleSave = () => {
    assignItemsToSection(section.id, selectedIds);
    navigate('/restaurant-portal/menu/sections');
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <button
          onClick={() => navigate('/restaurant-portal/menu/sections')}
          className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 cursor-pointer"
        >
          <ArrowLeft size={13} />
        </button>
        <div>
          <h3 className="text-sm font-black text-neutral-800">Assign Items to Section</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Link and display specific dishes inside the operational group: <strong className="text-neutral-700">"{section.name}"</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Save size={12} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#e35205] bg-orange-50/10 shadow-3xs'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <CheckSquare size={16} className="text-[#e35205]" />
                ) : (
                  <Square size={16} className="text-neutral-300" />
                )}
                <div className="text-left">
                  <p className="text-xs font-bold text-neutral-800">{item.name}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{item.category} · {item.subcategory}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-neutral-800">₹{item.basePrice}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

// ─── Sections list display dashboard ──────────────────────────────────────────
export const SectionList: React.FC = () => {
  const navigate = useNavigate();
  const { sections, updateSection } = usePortalCategoryStore();

  const handleToggleStatus = (id: string, current: 'active' | 'inactive') => {
    updateSection(id, { status: current === 'active' ? 'inactive' : 'active' });
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Description info */}
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Menu Promotional Sections</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Spotlight certain dishes at premium catalog sections (e.g. Featured, Bestsellers) to drive menu conversions.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <Card key={sec.id} className="flex flex-col justify-between gap-4">
            
            {/* Core meta info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider bg-neutral-50 text-neutral-500 border-neutral-200">
                  <Tag size={9} />
                  Promotional
                </span>

                {/* Status indicator */}
                <button
                  onClick={() => handleToggleStatus(sec.id, sec.status)}
                  className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    sec.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                  }`}
                >
                  {sec.status}
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-800">{sec.name}</h4>
                <p className="text-[10px] text-neutral-400 leading-relaxed mt-0.5">{sec.description}</p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 mt-auto">
              <span className="text-[10px] font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                {sec.itemIds.length} dishes linked
              </span>

              <button
                onClick={() => navigate(`/restaurant-portal/menu/sections/${sec.id}`)}
                className="text-[10px] font-black text-[#e35205] hover:text-[#c94804] uppercase tracking-wider cursor-pointer"
              >
                Assign Items
              </button>
            </div>

          </Card>
        ))}
      </div>

      {/* AI Suggestion Placeholder banner */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">AI Section Recommender</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            AI has detected that menu item " dragon salmon sushi roll " has been ordered 14 times yesterday. We suggest adding it to your "Bestselling Favorites" menu section.
          </p>
        </div>
      </div>

    </div>
  );
};
