import React from 'react';
import { Globe, ShieldCheck, CheckCircle2, Server } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';

export const UptimeAvailability: React.FC = () => {
  const { regions } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Regional Node Availability
            </span>
            <span className="text-xs text-neutral-400 font-bold">Multi-Region Ingress Routing</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Regional Service Uptime & Availability Status
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor infrastructure uptime across Mumbai, Frankfurt, and N. Virginia edge ingress nodes, track partial outages, and verify failover readiness.
          </p>
        </div>
      </div>

      {/* Regional Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {regions.map((reg) => (
          <div key={reg.regionCode} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {reg.regionCode}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {reg.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-black text-neutral-900 font-heading">{reg.regionName}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Latency: {reg.latencyMs}ms</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex justify-between items-center text-xs">
              <span className="text-emerald-900 font-bold">Uptime SLA:</span>
              <span className="font-black text-emerald-600 text-sm">{reg.uptimePercentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UptimeAvailability;
