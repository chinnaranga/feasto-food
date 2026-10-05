import React, { useState } from 'react';
import { Key, Search, ShieldAlert, CheckCircle2, Globe, Monitor } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';

export const AccessSecurity: React.FC = () => {
  const { accessEvents } = useAdminSecurityStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = accessEvents.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.eventType === filterType;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Platform Access Security & Anomaly Telemetry
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Monitor authentication activity, detect impossible travel sign-in anomalies, inspect device fingerprints, and audit session risk scores
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Access Events' },
            { id: 'suspicious_login', label: 'Suspicious Sign-Ins' },
            { id: 'login_success', label: 'Successful Logins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                <th className="py-3 px-4">User Email / Role</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">IP Address & Location</th>
                <th className="py-3 px-4">Device Fingerprint</th>
                <th className="py-3 px-4 text-center">Session Risk</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-black text-neutral-900">
                    <div>{ev.userEmail}</div>
                    <span className="text-[10px] text-neutral-400 font-normal">{ev.userRole}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ev.eventType === 'suspicious_login'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {ev.eventType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-800">
                    {ev.ipAddress} <span className="text-neutral-400 font-sans">({ev.location})</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 font-normal">{ev.deviceFingerprint}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-xs font-black ${
                        ev.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {ev.riskScore}%
                    </span>
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
  );
};

export default AccessSecurity;
