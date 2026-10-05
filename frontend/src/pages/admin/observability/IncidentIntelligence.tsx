import React from 'react';
import { Flame, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import useAdminObservabilityStore from '../../../store/admin/adminObservabilityStore';

export const IncidentIntelligence: React.FC = () => {
  const { insights } = useAdminObservabilityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              ● Automated Root Cause Correlation
            </span>
            <span className="text-xs text-neutral-400 font-bold">Incident Signal Intelligence</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Incident Correlation & Root Cause Intelligence
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Correlate error spikes with recent release builds, detect recurring anomaly patterns, and surface automated root cause hypotheses.
          </p>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => (
          <div key={ins.id} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#e35205]" />
              <h4 className="text-xs font-black text-neutral-900 font-heading">{ins.title}</h4>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">{ins.description}</p>
            <div className="pt-2 border-t border-neutral-100 flex justify-between text-[10px]">
              <span className="font-bold text-neutral-400">Severity: {ins.severity}</span>
              <span className="font-black text-[#e35205]">{ins.impactText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentIntelligence;
