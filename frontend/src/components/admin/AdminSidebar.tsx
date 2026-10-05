import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Truck,
  LifeBuoy,
  Tag,
  BarChart3,
  FileText,
  Settings,
  CircleDot,
} from 'lucide-react';
import { useAdminStore, AdminPermission, SupportTicket } from '../../store/admin/adminStore';

export const AdminSidebar: React.FC = () => {
  const { activePermissions, activeRole, tickets, orders, restaurants } = useAdminStore();

  // Helper to check if a navigation section is allowed for the active user's permissions
  const hasPermission = (permission: AdminPermission): boolean => {
    return activePermissions.includes(permission);
  };

  // Define nav links with their required permissions, icons, and labels
  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: 'view_dashboard' as const,
    },
    {
      to: '/admin/restaurants',
      label: 'Restaurants',
      icon: UtensilsCrossed,
      permission: 'manage_restaurants' as const,
      badge: restaurants.filter((r) => r.status === 'pending').length || undefined,
    },
    {
      to: '/admin/orders',
      label: 'Live Orders',
      icon: ShoppingBag,
      permission: 'manage_orders' as const,
      badge: orders.filter((o: { status: string }) => o.status === 'placed' || o.status === 'preparing').length || undefined,
    },
    {
      to: '/admin/users',
      label: 'User Directory',
      icon: Users,
      permission: 'manage_users' as const,
    },
    {
      to: '/admin/delivery',
      label: 'Delivery Ops',
      icon: Truck,
      permission: 'manage_delivery' as const,
    },
    {
      to: '/admin/support',
      label: 'Customer Support',
      icon: LifeBuoy,
      permission: 'manage_support' as const,
      badge: tickets.filter((t: SupportTicket) => t.status === 'open').length || undefined,
    },
    {
      to: '/admin/marketing',
      label: 'Campaigns',
      icon: Tag,
      permission: 'manage_marketing' as const,
    },
    {
      to: '/admin/analytics',
      label: 'Insights & Funnels',
      icon: BarChart3,
      permission: 'view_analytics' as const,
    },
    {
      to: '/admin/content',
      label: 'Content & FAQs',
      icon: FileText,
      permission: 'manage_content' as const,
    },
    {
      to: '/admin/settings',
      label: 'System Settings',
      icon: Settings,
      permission: 'manage_settings' as const,
    },
  ];

  return (
    <aside className="w-64 border-r border-border-main bg-primary-bg flex flex-col h-screen sticky top-0 text-left select-none shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border-main flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-orange text-white text-base font-black shadow-soft">
            F
          </span>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-text-primary tracking-tight">
              Feasto Ops
            </span>
            <span className="text-[10px] text-text-muted font-semibold tracking-wide uppercase">
              Operations
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-success-main text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-main/5 border border-success-main/15">
          <CircleDot size={10} className="animate-pulse" />
          Live
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto" aria-label="Admin console navigation">
        {navItems.map((item) => {
          if (!hasPermission(item.permission)) return null;

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-main cursor-pointer
                ${
                  isActive
                    ? 'bg-surface-bg text-brand-orange shadow-inner border-l-2 border-brand-orange'
                    : 'text-text-secondary hover:bg-surface-bg/50 hover:text-text-primary'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 text-[9px] font-extrabold text-white rounded-full bg-brand-orange shadow-soft">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile summary */}
      <div className="p-4 border-t border-border-main bg-surface-bg/30 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-black flex items-center justify-center text-sm uppercase">
          {activeRole.substring(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-text-primary truncate">Operations Manager</p>
          <p className="text-[10px] text-brand-orange font-bold uppercase mt-0.5 truncate tracking-wider">
            {activeRole.replace('_', ' ')}
          </p>
        </div>
      </div>
    </aside>
  );
};
