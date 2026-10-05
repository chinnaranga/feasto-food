import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, List, CheckCircle, FileText, Archive, ChevronRight, Folders, Bookmark, ArrowUpDown } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import PortalLoader from '../common/PortalLoader';
import usePortalMenuStore from '../../store/portalMenuStore';
import usePortalCategoryStore from '../../store/portalCategoryStore';

export const MenuLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = usePortalMenuStore();

  const isEditorPage = location.pathname.includes('/new') || /menu\/item-/.test(location.pathname);

  // Status counts
  const totalCount = items.length;
  const publishedCount = items.filter((i) => i.status === 'published').length;
  const draftCount = items.filter((i) => i.status === 'draft').length;
  const archivedCount = items.filter((i) => i.status === 'archived').length;

  const { categories, sections } = usePortalCategoryStore();
  const categoriesCount = categories.length;
  const sectionsCount = sections.length;

  const sideNav = [
    { label: 'All Catalog Items', path: '/restaurant-portal/menu', icon: <List size={13} />, count: totalCount, end: true },
    { label: 'Published Live', path: '/restaurant-portal/menu/published', icon: <CheckCircle size={13} />, count: publishedCount, end: false },
    { label: 'Drafts Mode', path: '/restaurant-portal/menu/drafts', icon: <FileText size={13} />, count: draftCount, end: false },
    { label: 'Archived / Hidden', path: '/restaurant-portal/menu/archive', icon: <Archive size={13} />, count: archivedCount, end: false },
    { label: 'Category Trees', path: '/restaurant-portal/menu/categories', icon: <Folders size={13} />, count: categoriesCount, end: false },
    { label: 'Menu Sections', path: '/restaurant-portal/menu/sections', icon: <Bookmark size={13} />, count: sectionsCount, end: false },
    { label: 'Hierarchy Sequencer', path: '/restaurant-portal/menu/organization', icon: <ArrowUpDown size={13} />, count: 0, end: false },
  ];

  return (
    <PageContainer className="pb-16">
      {/* Page Header */}
      <PortalPageHeader
        title="Menu & Catalog Manager"
        description="Expose categories, manage base and discount prices, upload dish gallery cards, and coordinate variants."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/menu/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Item</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/menu')}
              className="inline-flex items-center gap-1 px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          )
        }
      />

      {isEditorPage ? (
        /* Full width layout for clean form editor workspace */
        <div className="w-full mt-6">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        /* Split view layout: Sidebar on the left, Explorer grid on the right */
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
          
          {/* Sub navigation column */}
          <aside className="w-full lg:w-60 shrink-0 space-y-1.5 select-none bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-3.5 block mb-2">
              Catalog Scopes
            </span>
            <nav className="space-y-0.5">
              {sideNav.map((node) => (
                <NavLink
                  key={node.path}
                  to={node.path}
                  end={node.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer justify-between ${
                      isActive
                        ? 'bg-neutral-50 text-[#e35205] border border-neutral-200/50 shadow-3xs'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {node.icon}
                    <span>{node.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {node.label !== 'Hierarchy Sequencer' && (
                      <span className="text-[10px] font-black text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-neutral-300" />
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Active catalog panel grid outlet */}
          <div className="flex-1 w-full bg-white border border-neutral-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 min-h-[500px]">
            <Suspense fallback={<PortalLoader />}>
              <Outlet />
            </Suspense>
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default MenuLayout;
