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
  const { sections, assignItemsToSection } = usePortalCategoryStore();
  const { items } = usePortalMenuStore();

  const section = sections.find((s) => s.id === id);
  const [selectedIds, setSelectedIds] = useState<string[]>(section?.itemIds || []);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center select-none font-mono">
        <AlertCircle size={20} className="text-[#991B1B] mb-2" />
        <h4 className="text-xs font-bold text-[#141518] uppercase tracking-wider">Section Not Found</h4>
        <button
          onClick={() => navigate('/restaurant-portal/menu/sections')}
          className="text-xs text-[#1B3BFF] mt-2 cursor-pointer font-bold uppercase tracking-wider hover:underline"
        >
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
    <div className="space-y-6 text-left select-none font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#141518]/15 pb-4">
        <button
          onClick={() => navigate('/restaurant-portal/menu/sections')}
          className="p-2 border border-[#141518]/20 bg-[#FAF8F5] hover:bg-[#141518] hover:text-[#FAF8F5] text-[#141518] transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
        </button>
        <div>
          <h3 className="font-heading font-black text-sm uppercase tracking-tight text-[#141518]">Assign Items to Section</h3>
          <p className="font-mono text-xs text-[#52555F] mt-0.5">
            Link and display specific dishes inside the operational group: <strong className="text-[#141518]">"{section.name}"</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
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
              className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#141518] bg-[#F3F0E8] shadow-[3px_3px_0px_#141518]'
                  : 'border-[#141518]/20 bg-[#FAF8F5] hover:border-[#141518]'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSelected ? (
                  <CheckSquare size={16} className="text-[#1B3BFF]" />
                ) : (
                  <Square size={16} className="text-[#52555F]/40" />
                )}
                <div className="text-left">
                  <p className="text-xs font-bold text-[#141518]">{item.name}</p>
                  <p className="text-[10px] text-[#52555F] mt-0.5">{item.category} · {item.subcategory}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#141518]">₹{item.basePrice}</span>
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
    <div className="space-y-6 text-left select-none font-mono">
      {/* Description info */}
      <div className="border-b border-[#141518]/15 pb-3">
        <h3 className="font-heading font-black text-xs text-[#52555F] uppercase tracking-widest">Menu Promotional Sections</h3>
        <p className="font-mono text-xs text-[#52555F] mt-0.5">
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider bg-[#F3F0E8] text-[#52555F] border-[#141518]/20">
                  <Tag size={9} />
                  Promotional
                </span>

                {/* Status indicator */}
                <button
                  onClick={() => handleToggleStatus(sec.id, sec.status)}
                  className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    sec.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-[#F3F0E8] text-[#52555F] border-[#141518]/20'
                  }`}
                >
                  {sec.status}
                </button>
              </div>

              <div>
                <h4 className="font-heading font-black text-xs uppercase tracking-tight text-[#141518]">{sec.name}</h4>
                <p className="text-[10px] text-[#52555F] leading-relaxed mt-0.5">{sec.description}</p>
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between border-t border-[#141518]/10 pt-3 mt-auto">
              <span className="text-[10px] font-bold text-[#52555F] bg-[#141518]/10 px-2 py-0.5">
                {sec.itemIds.length} dishes linked
              </span>

              <button
                onClick={() => navigate(`/restaurant-portal/menu/sections/${sec.id}`)}
                className="text-[10px] font-bold text-[#1B3BFF] hover:text-[#141518] uppercase tracking-wider cursor-pointer"
              >
                Assign Items →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Suggestion Placeholder banner */}
      <div className="p-3.5 bg-[#FAF8F5] border border-[#141518]/20 shadow-[3px_3px_0px_#141518] flex items-start gap-2.5">
        <Sparkles size={14} className="text-[#1B3BFF] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-[#141518] uppercase tracking-widest">AI Section Recommender</p>
          <p className="text-[10px] text-[#52555F] mt-0.5 leading-relaxed">
            AI has detected that menu item "Dragon Salmon Sushi Roll" has been ordered 14 times yesterday. We suggest adding it to your "Bestselling Favorites" menu section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionList;
