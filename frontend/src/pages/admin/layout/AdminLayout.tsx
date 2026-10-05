import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Building2,
  Users,
  ShieldAlert,
  HelpCircle,
  ToggleLeft,
  FileText,
  Megaphone,
  Settings,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import useAdminStore, { AdminRole } from '../../../store/admin/adminStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { activeRole, setActiveRole } = useAdminStore();

  const navItems = [
    { label: 'Operations Room', path: '/admin/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Restaurant Oversight', path: '/admin/restaurants', icon: <Building2 size={14} /> },
    { label: 'User Governance & RBAC', path: '/admin/users', icon: <Users size={14} /> },
    { label: 'Trust & Safety Queue', path: '/admin/trust-safety', icon: <ShieldAlert size={14} /> },
    { label: 'Support Operations', path: '/admin/support', icon: <HelpCircle size={14} /> },
    { label: 'Feature Flags & Rollouts', path: '/admin/flags', icon: <ToggleLeft size={14} /> },
    { label: 'Audit & Compliance Logs', path: '/admin/audit-logs', icon: <FileText size={14} /> },
    { label: 'Platform Content', path: '/admin/content', icon: <Megaphone size={14} /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings size={14} /> },
    { label: 'System Health', path: '/admin/health', icon: <Activity size={14} /> },
  ];

  const getRoleLabel = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator (Full Privileges)';
      case 'support_lead':
        return 'Support Operations Lead';
      case 'trust_safety_officer':
        return 'Trust & Safety Auditor';
      case 'operations_lead':
        return 'Merchant Operations Director';
      default:
        return 'Compliance Auditor (Read-Only)';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F3F0E8] font-sans flex flex-col select-none text-left antialiased">
      {/* Super Admin Top Control Bar */}
      <header className="h-14 bg-[#14161B] text-white px-4 sm:px-6 flex items-center justify-between border-b border-[#252830] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1B3BFF] text-white flex items-center justify-center font-mono font-black text-xs">
            OP
          </div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-[#F3F0E8] font-heading">
              FEASTO OPERATIONS ROOM
            </h1>
            <span className="text-[9px] font-mono font-bold text-[#8E929C] block -mt-0.5 tracking-wider">
              MISSION CONTROL PLATFORM v2.6
            </span>
          </div>
        </div>

        {/* Top Controls: Role Switcher & System Status */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1D212A] border border-[#2D3342] font-mono text-xs">
            <ShieldCheck size={13} className="text-[#D7F04A] shrink-0" />
            <span className="text-[10px] text-[#8E929C] uppercase">SCOPE:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as AdminRole)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-[#14161B]">Super Administrator</option>
              <option value="support_lead" className="bg-[#14161B]">Support Operations Lead</option>
              <option value="trust_safety_officer" className="bg-[#14161B]">Trust & Safety Officer</option>
              <option value="operations_lead" className="bg-[#14161B]">Operations Lead</option>
              <option value="auditor" className="bg-[#14161B]">Read-Only Auditor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#D7F04A] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D7F04A] hidden sm:inline-block">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          <button
            onClick={async () => {
              await logout();
              navigate('/auth/signin');
            }}
            className="flex items-center gap-1.5 px-3 py-1 border border-[#661527] text-[#ff738c] hover:bg-[#661527] hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            title="Sign out of Admin Session"
          >
            <LogOut size={12} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#111317] border-r border-[#252830] shrink-0 hidden md:flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold text-[#8E929C] uppercase tracking-widest px-3 py-1 block">
              OPERATIONAL COMMANDS
            </span>

            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path.endsWith('/dashboard') &&
                  (location.pathname === '/admin' || location.pathname === '/admin/'));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1B3BFF] text-white font-bold'
                      : 'text-[#8E929C] hover:text-white hover:bg-[#1D212A]'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#8E929C]'}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Active Role Card Footer */}
          <div className="p-3 bg-[#14161B] border border-[#252830] text-left space-y-1 mt-6 font-mono">
            <span className="text-[9px] font-bold text-[#8E929C] uppercase tracking-wider block">
              ACTIVE CONTEXT
            </span>
            <span className="text-xs text-[#F3F0E8] block truncate">
              {getRoleLabel(activeRole)}
            </span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0D0F12]">
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-mono font-bold text-[#D7F04A] animate-pulse">
                INITIALIZING OPERATIONS ROOM...
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
