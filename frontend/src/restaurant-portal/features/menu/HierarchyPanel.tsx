import React from 'react';
import { ArrowUp, ArrowDown, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import usePortalCategoryStore from '../../store/portalCategoryStore';
import Card from '../../components/ui/Card';

export const HierarchyPanel: React.FC = () => {
  const { categories, reorderCategories } = usePortalCategoryStore();

  // Root categories only for ordering
  const rootCats = categories.filter((c) => !c.parentId).sort((a, b) => a.priority - b.priority);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === rootCats.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newOrder = [...rootCats];

    // Swap elements
    const temp = newOrder[index];
    newOrder[index] = newOrder[swapIndex];
    newOrder[swapIndex] = temp;

    // Build array of all IDs to trigger state update
    const allIds = [
      ...newOrder.map((c) => c.id),
      // Keep children IDs as they are
      ...categories.filter((c) => c.parentId).map((c) => c.id),
    ];
    reorderCategories(allIds);
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Description Header */}
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Hierarchy & Menu Sequencer</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Order the sequence of top-level categories as they appear to customers on client-app search displays.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Order list */}
        <div className="lg:col-span-2 space-y-3">
          {rootCats.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-neutral-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-neutral-400 bg-neutral-100 w-5 h-5 rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">{cat.name}</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{cat.description}</p>
                </div>
              </div>

              {/* Up Down arrows */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className={`p-2 rounded-xl border transition-colors ${
                    idx === 0
                      ? 'border-neutral-100 text-neutral-200 cursor-not-allowed bg-neutral-50/50'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 cursor-pointer'
                  }`}
                  title="Move Up"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === rootCats.length - 1}
                  className={`p-2 rounded-xl border transition-colors ${
                    idx === rootCats.length - 1
                      ? 'border-neutral-100 text-neutral-200 cursor-not-allowed bg-neutral-50/50'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 cursor-pointer'
                  }`}
                  title="Move Down"
                >
                  <ArrowDown size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Health card */}
        <div className="space-y-6">
          <Card className="text-left space-y-4 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-[#1B3BFF]" />
              <h5 className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">
                Category Health Summary
              </h5>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#52555F]">Subcategory Depth</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px]">Optimal (1/3)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#52555F]">Empty Collections</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px]">None</span>
              </div>
            </div>
          </Card>

          {/* AI Optimizer Placeholder banner */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#141518]/20 shadow-[3px_3px_0px_#141518] flex items-start gap-2.5 font-mono">
            <Sparkles size={13} className="text-[#1B3BFF] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-[#141518] uppercase tracking-widest font-heading">AI Hierarchy Optimizer</p>
              <p className="text-[10px] text-[#52555F] mt-0.5 leading-relaxed">
                Placing "Mains & Platters" at priority slot 1 has driven 28% higher clicks on client apps during lunch peak hours. Keep this sequencer order.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HierarchyPanel;
