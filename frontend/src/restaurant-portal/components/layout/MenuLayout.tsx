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
    <PageContainer className="pb-16 font-mono text-left">
      {/* Page Header */}
      <PortalPageHeader
        title="Menu & Catalog Manager"
        description="Expose categories, manage base and discount prices, upload dish gallery cards, and coordinate variants."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/menu/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Item</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/menu')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 hover:bg-[#141518] hover:text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer"
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
          <aside className="w-full lg:w-64 shrink-0 space-y-1.5 select-none bg-[#FAF8F5] border border-[#141518]/15 p-3 shadow-[4px_4px_0px_#141518]">
            <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-widest px-3 block mb-2">
              Catalog Scopes
            </span>
            <nav className="space-y-1">
              {sideNav.map((node) => (
                <NavLink
                  key={node.path}
                  to={node.path}
                  end={node.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-mono transition-colors cursor-pointer justify-between ${
                      isActive
                        ? 'bg-[#141518] text-[#FAF8F5] font-bold border-l-2 border-[#D7F04A]'
                        : 'text-[#52555F] hover:bg-[#EBE7DD] hover:text-[#141518]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {node.icon}
                    <span>{node.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {node.label !== 'Hierarchy Sequencer' && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#141518]/10 text-[#141518]">
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-[#52555F]" />
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Active catalog panel grid outlet */}
          <div className="flex-1 w-full bg-[#FAF8F5] border border-[#141518]/15 shadow-[4px_4px_0px_#141518] p-6 min-h-[500px]">
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
