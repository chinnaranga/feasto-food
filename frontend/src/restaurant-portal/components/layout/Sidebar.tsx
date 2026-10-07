import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Flame,
  Utensils,
  Package,
  Users,
  BarChart2,
  Percent,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { usePortalStore } from '../../store/portalStore';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { usePortalOrderStore } from '../../store/portalOrderStore';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const { sidebarCollapsed, toggleSidebar, selectedRestaurant } = usePortalStore();
  const { user } = usePortalAuthStore();
  const { orders } = usePortalOrderStore();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'placed' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;

  const navItems = [
    { label: 'Overview', path: '/restaurant-portal/dashboard', code: '01', icon: <LayoutDashboard size={14} /> },
    {
      label: 'Live Orders',
      path: '/restaurant-portal/orders',
      code: '02',
      icon: <ShoppingBag size={14} />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    { label: 'Kitchen (KDS)', path: '/restaurant-portal/kitchen', code: '03', icon: <Flame size={14} /> },
    { label: 'Menu Studio', path: '/restaurant-portal/menu', code: '04', icon: <Utensils size={14} /> },
    { label: 'Inventory', path: '/restaurant-portal/inventory', code: '05', icon: <Package size={14} /> },
    { label: 'Staff Roster', path: '/restaurant-portal/staff', code: '06', icon: <Users size={14} /> },
    { label: 'Performance', path: '/restaurant-portal/analytics', code: '07', icon: <BarChart2 size={14} /> },
    { label: 'Promotions', path: '/restaurant-portal/promotions', code: '08', icon: <Percent size={14} /> },
    { label: 'Guest CRM', path: '/restaurant-portal/customers', code: '09', icon: <MessageSquare size={14} /> },
    { label: 'Station Settings', path: '/restaurant-portal/settings', code: '10', icon: <Settings size={14} /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FAF8F5] border-r border-[#141518]/15 select-none text-[#141518]">
      {/* Studio Brand Header */}
      <div className="h-16 border-b border-[#141518]/15 px-5 flex items-center justify-between shrink-0 bg-[#F3F0E8]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs shrink-0">
            FS
          </div>
          {!sidebarCollapsed && (
            <div className="text-left">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141518] block">
                RESTAURANT STUDIO
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#52555F] block truncate max-w-[130px]">
                {selectedRestaurant?.name || 'STATION ALPHA'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 border border-[#141518]/20 hover:bg-[#141518] hover:text-white transition-colors cursor-pointer text-[#141518]"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin text-left">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors group ${
                isActive
                  ? 'bg-[#141518] text-[#F3F0E8] font-bold border-l-2 border-[#D7F04A]'
                  : 'text-[#52555F] hover:bg-[#EBE7DD] hover:text-[#141518]'
              }`
            }
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="tracking-wide uppercase text-[11px] truncate">
                  <span className="text-[#8A8D98] mr-1.5 group-hover:text-current">{item.code}</span>
                  {item.label}
                </span>
              )}
            </div>

            {!sidebarCollapsed && item.badge !== undefined && (
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-[#D7F04A] text-[#141518] border border-[#141518] shrink-0">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Kitchen Telemetry Ticker */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-[#141518]/15 bg-[#EBE7DD]/60 font-mono text-left">
          <div className="flex items-center justify-between text-[10px] text-[#52555F] mb-1">
            <span className="uppercase">HEARTH TELEMETRY</span>
            <span className="flex items-center gap-1 text-[#15803D] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-ping" />
              LIVE
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#141518] truncate">
            {selectedRestaurant?.branchCode || 'STATION-01'} · POS READY
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen overflow-hidden transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[990] lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 z-[1000] lg:hidden transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
