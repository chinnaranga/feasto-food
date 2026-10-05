import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
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
  Building2
} from 'lucide-react';
import { usePortalStore } from '../../store/portalStore';
import { usePortalAuthStore } from '../../store/portalAuthStore';
import { NAVIGATION_NODES } from '../../constants/portal';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={14} />,
  ShoppingBag: <ShoppingBag size={14} />,
  Utensils: <Utensils size={14} />,
  Package: <Package size={14} />,
  Users: <Users size={14} />,
  BarChart2: <BarChart2 size={14} />,
  Percent: <Percent size={14} />,
  MessageSquare: <MessageSquare size={14} />,
  Settings: <Settings size={14} />,
  Building2: <Building2 size={14} />,
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const { sidebarCollapsed, toggleSidebar } = usePortalStore();
  const { user } = usePortalAuthStore();

  const userRole = user?.role || 'Staff';

  // Filter routes based on user roles (RBAC)
  const allowedNodes = NAVIGATION_NODES.filter((node) => node.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand logo block */}
      <div className="h-14 border-b border-neutral-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e35205] flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
            <Store size={14} />
          </div>
          {!sidebarCollapsed && (
            <span className="text-xs font-black tracking-tight text-neutral-800 uppercase">
              Feasto Portal
            </span>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-main cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin text-left">
        {allowedNodes.map((node) => {
          const icon = iconMap[node.iconName] || null;
          return (
            <NavLink
              key={node.path}
              to={node.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'bg-neutral-50 text-[#e35205] border border-neutral-200/50 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`
              }
            >
              <span className="shrink-0">{icon}</span>
              {!sidebarCollapsed && <span className="truncate">{node.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer metadata */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 text-[9px] font-bold text-neutral-400 shrink-0 text-left">
          <span>Merchant Engine v1.0</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block border-r border-neutral-200 transition-all duration-200 sticky top-0 h-screen overflow-hidden ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[990] lg:hidden"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-neutral-200 z-[1000] lg:hidden transition-transform duration-250 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
};
export default Sidebar;
