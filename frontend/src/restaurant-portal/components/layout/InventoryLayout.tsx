import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, LayoutGrid, AlertTriangle, AlertCircle, Calendar, Trash2, ChevronRight, Bookmark } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import PortalLoader from '../common/PortalLoader';
import usePortalInventoryStore from '../../store/portalInventoryStore';

export const InventoryLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = usePortalInventoryStore();

  const isEditorPage = location.pathname.includes('/new') || /inventory\/stock-/.test(location.pathname);

  // Stats Counters
  const totalCount = items.length;
  const lowStockCount = items.filter((i) => i.currentQuantity > 0 && i.currentQuantity <= i.reorderPoint).length;
  const outOfStockCount = items.filter((i) => i.currentQuantity === 0).length;

  const expiredCount = items.filter((i) => {
    if (!i.expiryDate) return false;
    return new Date(i.expiryDate).getTime() < Date.now();
  }).length;

  const nearExpiryCount = items.filter((i) => {
    if (!i.expiryDate) return false;
    const timeDiff = new Date(i.expiryDate).getTime() - Date.now();
    const daysDiff = Math.ceil(timeDiff / (24 * 3600 * 1000));
    return daysDiff >= 0 && daysDiff <= 7; // within 7 days
  }).length;

  const expiryCount = expiredCount + nearExpiryCount;

  // Waste logs count
  const wasteCount = items.reduce((total, i) => total + i.wasteLogs.length, 0);

  const sideNav = [
    { label: 'All Stock Inventory', path: '/restaurant-portal/inventory', icon: <LayoutGrid size={13} />, count: totalCount, end: true },
    { label: 'Low Stock Alerts', path: '/restaurant-portal/inventory/low-stock', icon: <AlertTriangle size={13} />, count: lowStockCount, end: false },
    { label: 'Out of Stock', path: '/restaurant-portal/inventory/out-of-stock', icon: <AlertCircle size={13} />, count: outOfStockCount, end: false },
    { label: 'Expiry Tracking', path: '/restaurant-portal/inventory/expiry', icon: <Calendar size={13} />, count: expiryCount, end: false },
    { label: 'Waste Logs Logger', path: '/restaurant-portal/inventory/waste', icon: <Trash2 size={13} />, count: wasteCount, end: false },
  ];

  return (
    <PageContainer className="pb-16">
      {/* Page Header */}
      <PortalPageHeader
        title="Inventory & Stock Control"
        description="Oversee raw ingredients, manage minimum safety margins, track expiries, and record kitchen waste."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/inventory/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Stock Item</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/inventory')}
              className="inline-flex items-center gap-1 px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
            >
              Back to Stock
            </button>
          )
        }
      />

      {isEditorPage ? (
        /* Full width layout for clean editor */
        <div className="w-full mt-6">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        /* Split view: Nav on left, Outlet on right */
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
          
          {/* Sub Navigation Sidebar */}
          <aside className="w-full lg:w-60 shrink-0 space-y-1.5 select-none bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-3.5 block mb-2">
              Inventory Scopes
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
                    {node.count > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        node.label.includes('Out of Stock') || node.label.includes('Expiry') ? 'bg-red-100 text-red-700' :
                        node.label.includes('Low Stock') ? 'bg-amber-100 text-amber-700' :
                        'bg-neutral-100 text-neutral-500'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-neutral-300" />
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Active inventory pane */}
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

export default InventoryLayout;
