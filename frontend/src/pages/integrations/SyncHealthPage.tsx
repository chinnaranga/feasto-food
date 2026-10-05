import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Activity, Database, Clock } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';

export const SyncHealthPage: React.FC = () => {
  const { syncHealth, triggerManualSync } = usePortalIntegrationsStore();

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Sync Engine Operational (p99 84ms)
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Data Sync Health, Conflict Resolver & Telemetry
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor real-time synchronization lag between Cloud Firestore, external POS billing systems, accounting ledgers, and delivery partner dispatch APIs.
          </p>
        </div>

        <button
          onClick={triggerManualSync}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <RefreshCw size={13} />
          <span>Force Full Re-Sync</span>
        </button>
      </div>

      {/* 4 Health Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Last Sync Timestamp
          </span>
          <span className="text-sm font-mono font-bold text-neutral-900 block truncate">
            {syncHealth.lastSyncTimestamp}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold mt-2 block">● Auto-sync active</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Sync Success Rate
          </span>
          <span className="text-2xl font-black font-mono text-neutral-900 leading-none">
            {syncHealth.syncSuccessRatePct}%
          </span>
          <span className="text-[10px] text-emerald-600 font-bold mt-2 block">Within SLA (&gt;99.5%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Average Sync Lag
          </span>
          <span className="text-2xl font-black font-mono text-neutral-900 leading-none">
            {syncHealth.avgSyncLagMs}ms
          </span>
          <span className="text-[10px] text-blue-600 font-bold mt-2 block">Low Latency Channel</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
            Pending Retry Queue
          </span>
          <span className="text-2xl font-black font-mono text-neutral-900 leading-none">
            {syncHealth.pendingRetryCount} Items
          </span>
          <span className="text-[10px] text-neutral-500 font-bold mt-2 block">0 Conflict Errors</span>
        </div>
      </div>

      {/* Sync Service Channels Status Grid */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-neutral-900 font-heading uppercase tracking-wider">
          Active Integration Channels Sync Matrix
        </h4>

        <div className="space-y-2.5 divide-y divide-neutral-100 text-xs">
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span className="font-bold text-neutral-800">Stripe & Razorpay Payment Ingestion</span>
            </div>
            <span className="font-mono text-neutral-500 text-[11px]">Synced 2m ago • 42ms lag</span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span className="font-bold text-neutral-800">WhatsApp Business Notification Channel</span>
            </div>
            <span className="font-mono text-neutral-500 text-[11px]">Synced 1m ago • 18ms lag</span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              <span className="font-bold text-neutral-800">Petpooja POS Menu & KDS Sync</span>
            </div>
            <span className="font-mono text-amber-600 font-bold text-[11px]">Degraded • 450ms lag (Retrying...)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncHealthPage;
