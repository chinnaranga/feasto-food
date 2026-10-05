import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  Zap,
  AlertOctagon,
  Globe,
  Database,
  GitBranch,
  Flame,
  Search,
  Grid,
  RefreshCw,
} from 'lucide-react';
import useAdminObservabilityStore, { ObservabilityTimeRange } from '../../../store/admin/adminObservabilityStore';

export const ObservabilityLayout: React.FC = () => {
  const location = useLocation();
  const { timeRange, setTimeRange, stabilityScore, errors } = useAdminObservabilityStore();

  const activeErrors = errors.filter((e) => e.status !== 'resolved');

  const observabilityNavTabs = [
    { label: 'Observability Dashboard', path: '/admin/observability/dashboard', icon: <Activity size={14} /> },
    { label: 'Performance Latency', path: '/admin/observability/performance', icon: <Zap size={14} /> },
    { label: 'Error Tracking', path: '/admin/observability/errors', icon: <AlertOctagon size={14} />, badge: activeErrors.length > 0 ? `${activeErrors.length}` : undefined },
    { label: 'Uptime & Availability', path: '/admin/observability/uptime', icon: <Globe size={14} /> },
    { label: 'Request & Queue Health', path: '/admin/observability/requests', icon: <Database size={14} /> },
    { label: 'Deployment Health', path: '/admin/observability/deployments', icon: <GitBranch size={14} /> },
    { label: 'Incident Intelligence', path: '/admin/observability/incidents', icon: <Flame size={14} /> },
    { label: 'Diagnostics & Tracing', path: '/admin/observability/diagnostics', icon: <Search size={14} /> },
    { label: 'Health by Module', path: '/admin/observability/modules', icon: <Grid size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Telemetry Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Live System Telemetry Stream
            </span>
            <span className="text-xs text-neutral-400 font-bold">AWS ap-south-1 (Mumbai)</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Platform Observability & Performance Intelligence
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Real-time latency profiling, error grouping, regional uptime SLA monitoring, request throughput telemetry, and deployment release health.
          </p>
        </div>

        {/* Top Controls: Time Scope Selector & Stability Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-1 bg-neutral-100 rounded-xl border border-neutral-200 flex gap-1 text-xs font-bold">
            {(['1h', '24h', '7d', '30d'] as ObservabilityTimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === range ? 'bg-white text-neutral-900 shadow-3xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Stability: {stabilityScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {observabilityNavTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path.endsWith('/dashboard') &&
                (location.pathname === '/admin/observability' || location.pathname === '/admin/observability/'));
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
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Observability Module...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default ObservabilityLayout;
