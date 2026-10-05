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
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left select-none space-y-4">
      <div>
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Nested Catalog Preview Tree</h4>
        <p className="text-[10px] text-neutral-400 mt-0.5">
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
              <div className="flex items-center gap-2 group py-1 hover:bg-neutral-50/50 rounded-lg px-2 -ml-2">
                {subcats.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  </div>
                )}

                <span className="text-neutral-400 shrink-0">
                  {isExpanded ? <FolderOpen size={14} className="text-[#e35205]/80" /> : <Folder size={14} />}
                </span>

                <span
                  onClick={() => navigate(`/restaurant-portal/menu/categories/${cat.id}/edit`)}
                  className="text-xs font-bold text-neutral-800 hover:text-[#e35205] cursor-pointer transition-colors"
                >
                  {cat.name}
                </span>

                <span className="text-[9px] font-black text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                  {parentCount} items
                </span>
              </div>

              {/* Subcategories (Children) Render */}
              {subcats.length > 0 && isExpanded && (
                <div className="pl-6 border-l border-neutral-100 ml-1 space-y-1">
                  {subcats.map((sub) => {
                    const childCount = getItemsCount(sub.name);
                    return (
                      <div key={sub.id} className="flex items-center gap-2 py-1.5 hover:bg-neutral-50/50 rounded-lg px-2 -ml-2">
                        <div className="w-3 border-b border-neutral-200 -mt-1.5 self-center shrink-0" />
                        
                        <Tag size={11} className="text-neutral-400 shrink-0" />
                        
                        <span
                          onClick={() => navigate(`/restaurant-portal/menu/categories/${sub.id}/edit`)}
                          className="text-xs font-semibold text-neutral-700 hover:text-[#e35205] cursor-pointer transition-colors"
                        >
                          {sub.name}
                        </span>

                        <span className="text-[9px] font-black text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
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

      <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
        <p className="text-[9px] text-neutral-400 leading-normal max-w-sm">
          Tip: Subcategories inherit schedule rules and visibility preferences from their parent collections automatically.
        </p>
        <button
          onClick={() => navigate('/restaurant-portal/menu/categories/new')}
          className="inline-flex items-center gap-1 text-[10px] font-black text-[#e35205] hover:text-[#c94804] cursor-pointer"
        >
          <PlusCircle size={12} /> Add Subcategory
        </button>
      </div>
    </div>
  );
};

export default CategoryTree;
