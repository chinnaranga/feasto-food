import React from 'react';
import { Grid, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';
import { ModuleHealthCard } from './ObservabilityComponents';

export const ModuleHealth: React.FC = () => {
  const { moduleHealth } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● All 6 Core Modules Operational
            </span>
            <span className="text-xs text-neutral-400 font-bold">End-to-End System Health</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Platform Subsystem & Module Telemetry Health
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Individual health telemetry, average latency benchmarks, and error rates across Customer App, Restaurant Portal, Admin Control Center, Security Desk, Finance Engine, and PWA.
          </p>
        </div>
      </div>

      {/* Module Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleHealth.map((mod) => (
          <ModuleHealthCard key={mod.moduleKey} module={mod} />
        ))}
      </div>
    </div>
  );
};

export default ModuleHealth;
