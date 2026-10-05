import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const RiskMonitoring: React.FC = () => {
  const { accessEvents } = useAdminSecurityStore();

  const highRiskEvents = accessEvents.filter((a) => a.riskScore > 50);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              ● Automated Risk Scoring Engine
            </span>
            <span className="text-xs text-neutral-400 font-bold">Threat Anomaly Telemetry</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Account Risk Monitoring & Anomaly Detection
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Monitor accounts flagged for high risk, detect repeated credential failure attempts, analyze IP subnet anomalies, and trigger defensive restrictions.
          </p>
        </div>
      </div>

      {/* High-Risk Accounts Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
          Flagged High-Risk Session Events
        </h3>

        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">Threat Type</th>
                  <th className="py-3 px-4">IP Subnet / Location</th>
                  <th className="py-3 px-4 text-center">Risk Score</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {highRiskEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">{ev.userEmail}</td>
                    <td className="py-3.5 px-4 text-red-600 font-bold capitalize">
                      {ev.eventType.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-800">
                      {ev.ipAddress} ({ev.location})
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-red-600">
                      {ev.riskScore}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400 text-[11px]">
                      {ev.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;
