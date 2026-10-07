import React from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Tag, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePortalCategoryStore from '../../store/portalCategoryStore';
import usePortalMenuStore from '../../store/portalMenuStore';

export const CategoryTree: React.FC = () => {
  const navigate = useNavigate();
  const { categories, expandedCategoryIds, toggleCategoryExpand } = usePortalCategoryStore();
  const { items } = usePortalMenuStore();

  const rootCategories = categories.filter((c) => !c.parentId);

  const getItemsCount = (catName: string) => {
    return items.filter((i) => i.category.toLowerCase() === catName.toLowerCase() || i.subcategory.toLowerCase() === catName.toLowerCase()).length;
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter((c) => c.parentId === parentId);
  };

  return (
    <div className="border border-[#141518]/15 bg-[#FAF8F5] p-6 text-left select-none space-y-4 font-mono shadow-[4px_4px_0px_#141518]">
      <div>
        <h4 className="font-heading font-black text-xs text-[#141518] uppercase tracking-wider">Nested Catalog Preview Tree</h4>
        <p className="font-mono text-[10px] text-[#52555F] mt-0.5">
          Recursive hierarchy mapping how items are organized inside customer-facing categories.
        </p>
      </div>

      <div className="space-y-3 pl-2">
        {rootCategories.map((cat) => {
          const subcats = getSubcategories(cat.id);
          const isExpanded = expandedCategoryIds.includes(cat.id);
          const parentCount = getItemsCount(cat.name);

          return (
            <div key={cat.id} className="space-y-1.5">
              {/* Parent Category Row */}
              <div className="flex items-center gap-2 group py-1 hover:bg-[#EBE7DD] px-2 -ml-2 transition-colors">
                {subcats.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="p-1 hover:bg-[#141518]/10 text-[#52555F] hover:text-[#141518] transition-colors cursor-pointer shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 bg-[#52555F]/40" />
                  </div>
                )}

                <span className="text-[#141518] shrink-0">
                  {isExpanded ? <FolderOpen size={14} className="text-[#1B3BFF]" /> : <Folder size={14} />}
                </span>

                <span
                  onClick={() => navigate(`/restaurant-portal/menu/categories/${cat.id}/edit`)}
                  className="text-xs font-bold text-[#141518] hover:text-[#1B3BFF] cursor-pointer transition-colors uppercase tracking-wider"
                >
                  {cat.name}
                </span>

                <span className="text-[9px] font-bold text-[#52555F] bg-[#141518]/10 px-1.5 py-0.5">
                  {parentCount} items
                </span>
              </div>

              {/* Subcategories (Children) Render */}
              {subcats.length > 0 && isExpanded && (
                <div className="pl-6 border-l border-[#141518]/15 ml-1 space-y-1">
                  {subcats.map((sub) => {
                    const childCount = getItemsCount(sub.name);
                    return (
                      <div key={sub.id} className="flex items-center gap-2 py-1.5 hover:bg-[#EBE7DD] px-2 -ml-2 transition-colors">
                        <div className="w-3 border-b border-[#141518]/20 -mt-1.5 self-center shrink-0" />
                        
                        <Tag size={11} className="text-[#52555F] shrink-0" />
                        
                        <span
                          onClick={() => navigate(`/restaurant-portal/menu/categories/${sub.id}/edit`)}
                          className="text-xs font-semibold text-[#52555F] hover:text-[#141518] cursor-pointer transition-colors uppercase tracking-wider"
                        >
                          {sub.name}
                        </span>

                        <span className="text-[9px] font-bold text-[#52555F] bg-[#141518]/10 px-1.5 py-0.5">
                          {childCount} items
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#141518]/10 pt-4 flex items-center justify-between">
        <p className="text-[9px] text-[#52555F] leading-normal max-w-sm">
          Tip: Subcategories inherit schedule rules and visibility preferences from their parent collections automatically.
        </p>
        <button
          onClick={() => navigate('/restaurant-portal/menu/categories/new')}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B3BFF] hover:text-[#141518] uppercase tracking-wider cursor-pointer"
        >
          <PlusCircle size={12} /> Add Subcategory
        </button>
      </div>
    </div>
  );
};

export default CategoryTree;
