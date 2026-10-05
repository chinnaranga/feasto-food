import React from 'react';
import { Activity, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Server, Cpu } from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';
import { SystemHealthCard } from './components/AdminComponents';

export const SystemHealth: React.FC = () => {
  const { serviceHealth } = useAdminStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Live Infrastructure Health Stream
            </span>
            <span className="text-xs text-neutral-400 font-bold">AWS ap-south-1 (Mumbai)</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            System Health & Infrastructure Service Status
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Real-time telemetry monitoring API routing latency, database connection pools, Firestore websocket sync channels, and CDN image delivery.
          </p>
        </div>

        <button
          onClick={() => alert('Refreshing live service telemetry metrics...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <RefreshCw size={13} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Service Health Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Platform Microservice Telemetry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceHealth.map((sh) => (
            <SystemHealthCard key={sh.serviceName} health={sh} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
