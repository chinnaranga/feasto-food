import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { useAdminStore } from '../../store/admin/adminStore';
import { AdminRole } from '../../types/admin';

export const TopNavbar: React.FC = () => {
  const location = useLocation();
  const { activeRole, setActiveRole } = useAdminStore();

  // Generate a page title based on the path
  const getPageTitle = () => {
    const segments = location.pathname.split('/');
    const last = segments[segments.length - 1] || 'dashboard';
    return last.charAt(0).toUpperCase() + last.slice(1).replace('_', ' ');
  };

  const getBreadcrumbs = () => {
    const title = getPageTitle();
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted select-none">
        <span>Admin</span>
        <span>/</span>
        <span className="text-text-primary font-bold">{title}</span>
      </div>
    );
  };

  const roleLabels: Record<AdminRole, string> = {
    super_admin: 'Super Admin (All Access)',
    admin: 'Administrator',
    restaurant_owner: 'Restaurant Owner',
    restaurant_manager: 'Restaurant Manager',
    support: 'Customer Support Agent',
    delivery_manager: 'Delivery Dispatcher',
    marketing: 'Marketing Campaigner',
    finance: 'Financial Comptroller',
    analyst: 'Business Analyst (Read Only)',
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveRole(e.target.value as AdminRole);
  };

  return (
    <header className="h-16 px-8 border-b border-border-main/60 bg-primary-bg/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-header select-none">
      {/* Left: Breadcrumbs / Title */}
      <div className="text-left">
        {getBreadcrumbs()}
        <h1 className="text-sm font-extrabold text-text-primary tracking-tight font-heading mt-0.5">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Tools & RBAC Selector */}
      <div className="flex items-center gap-5">
        {/* API Latency Simulated Status */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-semibold text-text-muted bg-surface-bg border border-border-main px-3 py-1.5 rounded-lg">
          <Cpu size={12} className="text-text-muted" />
          <span>Gateway: </span>
          <span className="text-success-main font-bold">12ms API</span>
        </div>

        {/* RBAC Impersonation Panel */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-brand-orange/5 border border-brand-orange/15 rounded-xl text-xs font-bold text-brand-orange">
          <UserCheck size={14} className="shrink-0" />
          <span className="hidden sm:inline">Role Impersonator:</span>
          <select
            value={activeRole}
            onChange={handleRoleChange}
            className="bg-transparent font-extrabold text-brand-orange focus:outline-none cursor-pointer text-xs pr-1 border-b border-dashed border-brand-orange/30 hover:border-brand-orange"
          >
            {Object.entries(roleLabels).map(([roleKey, label]) => (
              <option key={roleKey} value={roleKey} className="bg-primary-bg text-text-primary font-bold">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* System Warnings Alert Indicator (Pulsing if fraud flags are active) */}
        <div className="w-8 h-8 rounded-xl bg-surface-bg border border-border-main flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer relative">
          <ShieldAlert size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error-main animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error-main" />
        </div>
      </div>
    </header>
  );
};
