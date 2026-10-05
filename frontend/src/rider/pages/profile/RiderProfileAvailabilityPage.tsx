import React, { useState } from 'react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileAvailabilityPage: React.FC = () => {
  const { availability, updateAvailability, toggleBreakMode } = useRiderProfileStore();

  const [shiftWindow, setShiftWindow] = useState(availability.defaultShiftWindow);
  const [weeklyTarget, setWeeklyTarget] = useState(availability.weeklyTargetHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAvailability({
      defaultShiftWindow: shiftWindow as any,
      weeklyTargetHours: Number(weeklyTarget),
    });
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Duty Availability & Shifts" subtitle="Configure working hours, preferred shift windows, and break mode." />

      {/* Break Mode Banner */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-between">
        <div>
          <strong className="text-xs font-bold text-neutral-900 block">Pause Deliveries (Break Mode)</strong>
          <span className="text-[11px] text-neutral-500 block">Temporarily pause new order dispatches without going off duty.</span>
        </div>
        <button
          onClick={toggleBreakMode}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            availability.isBreakModeActive
              ? 'bg-amber-500 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          {availability.isBreakModeActive ? '⏸ Paused' : 'Active'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Preferred Shift Window</label>
          <select
            value={shiftWindow}
            onChange={(e) => setShiftWindow(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
          >
            <option value="morning">Morning Shift (08:00 - 13:00)</option>
            <option value="afternoon">Afternoon Lunch Peak (12:00 - 16:00)</option>
            <option value="evening">Evening Dinner Peak (18:00 - 23:00)</option>
            <option value="night">Late Night Shift (22:00 - 04:00)</option>
            <option value="flexible">Flexible Hours</option>
          </select>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Weekly Target Delivery Hours</label>
          <input
            type="number"
            value={weeklyTarget}
            onChange={(e) => setWeeklyTarget(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 font-mono font-bold focus:outline-none"
          />
        </div>

        <RiderButton variant="primary" type="submit" fullWidth>
          Save Availability Settings
        </RiderButton>
      </form>
    </div>
  );
};

export default RiderProfileAvailabilityPage;
