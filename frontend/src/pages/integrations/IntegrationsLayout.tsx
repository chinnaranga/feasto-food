import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Layers,
  Zap,
  Webhook,
  Key,
  Activity,
  ShoppingBag,
  Settings,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';

export const IntegrationsLayout: React.FC = () => {
  const location = useLocation();
  const { connectors, syncHealth, triggerManualSync } = usePortalIntegrationsStore();

  const connectedCount = connectors.filter((c) => c.status === 'connected').length;

  const navTabs = [
    { label: 'Overview', path: '/restaurant/integrations/dashboard', icon: <Layers size={14} /> },
    { label: 'App Connectors', path: '/restaurant/integrations/apps', icon: <Sliders size={14} /> },
    { label: 'Webhooks', path: '/restaurant/integrations/webhooks', icon: <Webhook size={14} /> },
    { label: 'Workflow Automations', path: '/restaurant/integrations/automations', icon: <Zap size={14} /> },
    { label: 'API & Keys', path: '/restaurant/integrations/api', icon: <Key size={14} /> },
    { label: 'Sync Health', path: '/restaurant/integrations/sync', icon: <RefreshCw size={14} /> },
    { label: 'Activity Logs', path: '/restaurant/integrations/logs', icon: <Activity size={14} /> },
    { label: 'App Marketplace', path: '/restaurant/integrations/marketplace', icon: <ShoppingBag size={14} /> },
    { label: 'Settings', path: '/restaurant/integrations/settings', icon: <Settings size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left p-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● {connectedCount} Apps Active & Synced
            </span>
            <span className="text-xs text-neutral-400 font-bold">Sync Health: {syncHealth.status.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Integrations, Webhooks & Workflow Automation Center
          </h2>
          <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
            Connect third-party payment gateways, delivery partners, POS billing terminals, and SMS/WhatsApp channels. Automate event-driven workflow rules, manage Webhook signatures, and inspect real-time sync telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={triggerManualSync}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <RefreshCw size={13} />
            <span>Sync Systems Now</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tab Bar */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {navTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path.endsWith('/dashboard') &&
                (location.pathname === '/restaurant/integrations' || location.pathname === '/restaurant/integrations/'));
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

      {/* Sub-Route View */}
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Integration Engine...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default IntegrationsLayout;
