import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Key,
  Lock,
  FileText,
  Bookmark,
  Activity,
  Database,
  Eye,
  EyeOff,
} from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const SecurityLayout: React.FC = () => {
  const location = useLocation();
  const { isDataMasked, toggleDataMasking, incidents, privacyRequests } = useAdminSecurityStore();

  const openIncidents = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'closed');
  const pendingPrivacy = privacyRequests.filter((p) => p.status !== 'completed');

  const securityNavTabs = [
    { label: 'Security Dashboard', path: '/admin/security/dashboard', icon: <ShieldAlert size={14} /> },
    { label: 'Incident Response', path: '/admin/security/incidents', icon: <Activity size={14} />, badge: openIncidents.length > 0 ? `${openIncidents.length}` : undefined },
    { label: 'Compliance Overview', path: '/admin/security/compliance', icon: <FileCheck size={14} /> },
    { label: 'Privacy Requests', path: '/admin/security/privacy-requests', icon: <UserCheck size={14} />, badge: pendingPrivacy.length > 0 ? `${pendingPrivacy.length}` : undefined },
    { label: 'Access Security', path: '/admin/security/access', icon: <Key size={14} /> },
    { label: 'Sensitive Actions', path: '/admin/security/sensitive-actions', icon: <Lock size={14} /> },
    { label: 'Audit Readiness', path: '/admin/security/audit-readiness', icon: <FileText size={14} /> },
    { label: 'Policy Management', path: '/admin/security/policies', icon: <Bookmark size={14} /> },
    { label: 'Risk Monitoring', path: '/admin/security/risk', icon: <ShieldCheck size={14} /> },
    { label: 'Data Protection & PII', path: '/admin/security/data-protection', icon: <Database size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Control Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              ● Security & Compliance Desk
            </span>
            <span className="text-xs text-neutral-400 font-bold">Feasto Platform Governance</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Security Operations & Regulatory Compliance Center
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor real-time security telemetry, handle privacy data export/deletion requests, inspect sensitive administrative actions, and audit SOC-2/DPDP posture.
          </p>
        </div>

        {/* Global PII Masking Control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDataMasking}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDataMasked
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isDataMasked ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>PII Masking: <strong>{isDataMasked ? 'ENABLED' : 'REVEALED'}</strong></span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {securityNavTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path.endsWith('/dashboard') &&
                (location.pathname === '/admin/security' || location.pathname === '/admin/security/'));
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-3xs'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <span className={isActive ? 'text-[#e35205]' : 'text-neutral-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#e35205] text-white' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sub-Route Container */}
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Security Operations Module...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default SecurityLayout;
