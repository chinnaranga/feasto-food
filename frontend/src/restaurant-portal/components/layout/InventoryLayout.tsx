import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, LayoutGrid, AlertTriangle, AlertCircle, Calendar, Trash2, ChevronRight } from 'lucide-react';
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
    return daysDiff >= 0 && daysDiff <= 7;
  }).length;

  const expiryCount = expiredCount + nearExpiryCount;
  const wasteCount = items.reduce((total, i) => total + i.wasteLogs.length, 0);

  const sideNav = [
    { label: 'All Stock Inventory', path: '/restaurant-portal/inventory', icon: <LayoutGrid size={13} />, count: totalCount, end: true },
    { label: 'Low Stock Alerts', path: '/restaurant-portal/inventory/low-stock', icon: <AlertTriangle size={13} />, count: lowStockCount, end: false },
    { label: 'Out of Stock', path: '/restaurant-portal/inventory/out-of-stock', icon: <AlertCircle size={13} />, count: outOfStockCount, end: false },
    { label: 'Expiry Tracking', path: '/restaurant-portal/inventory/expiry', icon: <Calendar size={13} />, count: expiryCount, end: false },
    { label: 'Waste Logs Logger', path: '/restaurant-portal/inventory/waste', icon: <Trash2 size={13} />, count: wasteCount, end: false },
  ];

  return (
    <PageContainer className="pb-16 font-mono text-left">
      {/* Page Header */}
      <PortalPageHeader
        title="Inventory & Stock Control"
        description="Oversee raw ingredients, manage minimum safety margins, track expiries, and record kitchen waste."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/inventory/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Stock Item</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/inventory')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 hover:bg-[#141518] hover:text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer"
            >
              Back to Stock
            </button>
          )
        }
      />

      {isEditorPage ? (
        <div className="w-full mt-6">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
          {/* Sub Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-1.5 select-none bg-[#FAF8F5] border border-[#141518]/15 p-3 shadow-[4px_4px_0px_#141518]">
            <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-widest px-3 block mb-2">
              Inventory Scopes
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
                    {node.count > 0 && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                        node.label.includes('Out of Stock') || node.label.includes('Expiry') ? 'bg-red-50 text-red-800 border-red-300' :
                        node.label.includes('Low Stock') ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        'bg-[#141518]/10 text-[#141518] border-[#141518]/15'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-[#52555F]" />
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Active inventory outlet */}
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

export default InventoryLayout;
