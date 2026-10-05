import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Rocket,
  CheckCircle2,
  Key,
  GitBranch,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  FileText,
  ListCheck,
  Play,
} from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';

export const ReleaseLayout: React.FC = () => {
  const location = useLocation();
  const { version, deploymentGate, rollbackState, runBuildChecks } = useAdminReleaseStore();

  const releaseNavTabs = [
    { label: 'Release Dashboard', path: '/admin/release/dashboard', icon: <Rocket size={14} /> },
    { label: 'Build Verification', path: '/admin/release/builds', icon: <CheckCircle2 size={14} /> },
    { label: 'Environment Safety', path: '/admin/release/environment', icon: <Key size={14} /> },
    { label: 'Semantic Versioning', path: '/admin/release/versions', icon: <GitBranch size={14} /> },
    { label: 'Deployment Gate', path: '/admin/release/deployments', icon: <ShieldCheck size={14} /> },
    { label: 'Client Update & Recovery', path: '/admin/release/update', icon: <RefreshCw size={14} /> },
    { label: 'Rollback Desk', path: '/admin/release/rollback', icon: <RotateCcw size={14} /> },
    { label: 'Release Notes', path: '/admin/release/notes', icon: <FileText size={14} /> },
    { label: 'Launch Readiness', path: '/admin/release/readiness', icon: <ListCheck size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Release Control Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Production Gate Approved ({version.appVersion})
            </span>
            <span className="text-xs text-neutral-400 font-bold">Git Commit: {version.commitHash}</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Release Engineering & Launch Automation Center
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Automated production build validation (TypeScript, ESLint, Bundle size), environment variable safety audits, release versioning, and instant rollback triggers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={runBuildChecks}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <Play size={13} />
            <span>Run Build Audits</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {releaseNavTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path.endsWith('/dashboard') &&
                (location.pathname === '/admin/release' || location.pathname === '/admin/release/'));
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
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sub-Route Container */}
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Release Engineering Module...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default ReleaseLayout;
