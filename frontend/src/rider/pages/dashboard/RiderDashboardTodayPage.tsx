import React from 'react';
import { Clock, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import useRiderDashboardStore from '../../store/useRiderDashboardStore';
import { RiderPageHeader, RiderButton } from '../../components/RiderUIComponents';

export const RiderDashboardTodayPage: React.FC = () => {
  const { schedule, assignedZone } = useRiderDashboardStore();

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Today's Shift Schedule" subtitle="Active shift window, break times, and peak demand forecast." />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Assigned Shift</span>
            <h4 className="text-sm font-black text-neutral-900 font-heading">{schedule.shiftName}</h4>
          </div>
          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Active Shift
          </span>
        </div>

        <div className="space-y-2 font-mono">
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Working Shift Time</span>
            <span className="font-bold text-neutral-900">{schedule.startTime} - {schedule.endTime}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Scheduled Break Window</span>
            <span className="font-bold text-neutral-900">{schedule.breakWindowTime}</span>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
            <span className="text-neutral-500">Primary Delivery Zone</span>
            <span className="font-bold text-neutral-900">{assignedZone}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles size={14} className="text-amber-600" />
            <span>Peak Demand Window (1.5x Surge Rate)</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Dinner demand peaks between 19:30 and 21:45 in Bandra West & Khar Zone. Stay online to maximize surge earnings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboardTodayPage;
