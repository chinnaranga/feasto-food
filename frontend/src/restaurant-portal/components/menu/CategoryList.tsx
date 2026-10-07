import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  FolderOpen,
  Eye,
  AlertCircle
} from 'lucide-react';
import usePortalCategoryStore from '../../store/portalCategoryStore';
import type { Category } from '../../store/portalCategoryStore';
import usePortalMenuStore from '../../store/portalMenuStore';
import { CategoryTree } from './CategoryTree';
import Card from '../../components/ui/Card';

export const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const { categories, deleteCategory, updateCategory } = usePortalCategoryStore();
  const { items } = usePortalMenuStore();

  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'archived'>('all');

  const rootCategories = categories.filter((c) => !c.parentId);

  const getItemsCount = (catName: string) => {
    // Exact match or subcategory match
    return items.filter((i) => i.category.toLowerCase() === catName.toLowerCase() || i.subcategory.toLowerCase() === catName.toLowerCase()).length;
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter((c) => c.parentId === parentId);
  };

  const filteredRootCats = rootCategories.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-5 text-left select-none">
      
      {/* Category Explorer Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Category Structures</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Organize dishes into parent categories and subcategories to streamline customer catalog listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filters */}
          <div className="bg-neutral-100 p-0.5 rounded-xl flex items-center border border-neutral-200/40">
            {(['all', 'published', 'archived'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterStatus(type)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  filterStatus === type
                    ? 'bg-white text-neutral-800 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex border border-[#141518]/20 p-0.5 bg-[#FAF8F5] shrink-0 font-mono">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer ${viewMode === 'list' ? 'bg-[#141518] text-[#D7F04A]' : 'text-[#52555F] hover:text-[#141518]'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider cursor-pointer ${viewMode === 'tree' ? 'bg-[#141518] text-[#D7F04A]' : 'text-[#52555F] hover:text-[#141518]'}`}
            >
              Hierarchy Tree
            </button>
          </div>

          {/* Create CTA */}
          <button
            type="button"
            onClick={() => navigate('/restaurant-portal/menu/categories/new')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-[10px] font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
          >
            <Plus size={12} /> Add Category
          </button>
        </div>
      </div>

      {/* Main Categories Panel */}
      {viewMode === 'tree' ? (
        <CategoryTree />
      ) : filteredRootCats.length > 0 ? (
        <div className="space-y-4">
          {filteredRootCats.map((cat) => {
            const subcats = getSubcategories(cat.id);
            const parentCount = getItemsCount(cat.name);

            return (
              <div
                key={cat.id}
                className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-neutral-300 transition-all"
              >
                {/* Parent Row */}
                <div className="flex items-center justify-between p-4 bg-neutral-50/50 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0 border border-neutral-200/40">
                      <FolderOpen size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">{cat.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Items counter */}
                    <span className="text-[9px] font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {parentCount} items
                    </span>

                    {/* Status badge */}
                    <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                      cat.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                    }`}>
                      {cat.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/restaurant-portal/menu/categories/${cat.id}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-neutral-200/50 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title="Edit Collection"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer"
                        title="Delete Collection"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories (Children) block */}
                {subcats.length > 0 ? (
                  <div className="p-4 bg-white divide-y divide-neutral-100">
                    {subcats.map((sub) => {
                      const childCount = getItemsCount(sub.name);
                      return (
                        <div key={sub.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 pl-11">
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-neutral-300" />
                            <span className="text-xs font-bold text-neutral-700">{sub.name}</span>
                            <span className="text-[9px] text-neutral-400 font-semibold italic">({sub.description})</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-neutral-400 bg-neutral-50 border border-neutral-200/40 px-1.5 py-0.5 rounded-full">
                              {childCount} items
                            </span>
                            <button
                              onClick={() => navigate(`/restaurant-portal/menu/categories/${sub.id}/edit`)}
                              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => deleteCategory(sub.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-14 py-3 text-[10px] text-neutral-400 italic bg-white">
                    No nested subcategories configured for this category scope.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2">
          <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-4">
            <AlertCircle size={16} />
          </div>
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            No Categories Found
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            There are no menu categories logged matching your filters. Click below to add a new category collection.
          </p>
          <button
            onClick={() => navigate('/restaurant-portal/menu/categories/new')}
            className="mt-4 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
          >
            Create Category
          </button>
        </Card>
      )}

    </div>
  );
};

export default CategoryList;
