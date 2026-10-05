import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderDashboardOverviewPage: React.FC = () => {
  const { activities, assignedZone } = useRiderDashboardStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Operational Readiness Overview" subtitle="Timeline log of recent delivery events, status shifts, and wallet transfers." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">
              Duty Compliance Status
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700">100% Operational SLA</span>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider font-heading">Recent Operational Timeline</h4>
          {activities.map((act) => (
            <div key={act.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
              <div className="flex justify-between items-center font-bold text-neutral-900">
                <span>{act.title}</span>
                <span className="text-[10px] text-neutral-400 font-mono">{act.timestamp}</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">{act.description}</p>
              {act.statusBadge && (
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-1">
                  {act.statusBadge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboardOverviewPage;
