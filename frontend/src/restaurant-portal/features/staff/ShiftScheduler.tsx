import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, AlertCircle, Plus, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import Card from '../../components/ui/Card';

export const ShiftScheduler: React.FC = () => {
  const { staff, shifts, assignShift, deleteShift } = usePortalStaffStore();

  const [activeStaffId, setActiveStaffId] = useState<string>('');
  const [shiftDate, setShiftDate] = useState<string>('');
  const [shiftStart, setShiftStart] = useState<string>('09:00');
  const [shiftEnd, setShiftEnd] = useState<string>('17:00');

  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaffId || !shiftDate) return;

    assignShift({
      staffId: activeStaffId,
      date: shiftDate,
      startTime: shiftStart,
      endTime: shiftEnd,
    });

    setShiftDate('');
    setShowAddForm(false);
  };

  // Check for scheduling conflicts (e.g., overlapping times for the same staff member on the same date)
  const getConflictWarning = (staffId: string, date: string, currentShiftId: string, start: string, end: string) => {
    const userShifts = shifts.filter((s) => s.staffId === staffId && s.date === date && s.id !== currentShiftId);
    
    for (const sh of userShifts) {
      // Simple overlapping check
      if (
        (start >= sh.startTime && start < sh.endTime) ||
        (end > sh.startTime && end <= sh.endTime) ||
        (start <= sh.startTime && end >= sh.endTime)
      ) {
        return `Overlapping shifts conflict on ${date} (${sh.startTime} - ${sh.endTime})`;
      }
    }
    return null;
  };

  const getStaffName = (staffId: string) => {
    return staff.find((m) => m.id === staffId)?.name || 'Unknown Staff';
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Roster Shift Scheduler</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Coordinate weekly schedules, assign station timing slots, and check for schedule overlapping conflicts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={12} /> Assign Shift
        </button>
      </div>

      {/* Quick Alerts Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uncovered Warning */}
        <div className="p-4 border border-amber-200 bg-amber-50/10 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
          <div>
            <h5 className="text-xs font-bold text-neutral-800">Uncovered Timings Alert</h5>
            <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
              Tomorrow's <strong>Dinner Peak (18:00 - 22:00)</strong> has 0 scheduled Cashiers. Assign a cashier shift to prevent register checkout delays.
            </p>
          </div>
        </div>

        {/* AI staffing tip */}
        <div className="p-4 border border-neutral-200 bg-neutral-50/30 rounded-2xl flex items-start gap-3">
          <Sparkles className="text-[#e35205] shrink-0 mt-0.5" size={15} />
          <div>
            <h5 className="text-xs font-bold text-neutral-800">AI Scheduling Assist</h5>
            <p className="text-[10px] text-neutral-500 leading-normal mt-0.5">
              Scheduling Suzuki Hiro (Delivery Coordinator) on lunch rush peaks has historically improved order dispatch times by 14%.
            </p>
          </div>
        </div>
      </div>

      {/* Add Shift Form */}
      {showAddForm && (
        <form onSubmit={handleAddShift} className="p-5 border border-neutral-200 bg-neutral-50/40 rounded-2xl space-y-4 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            
            {/* Staff */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="staffSelect" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Select Employee
              </label>
              <select
                id="staffSelect"
                value={activeStaffId}
                onChange={(e) => setActiveStaffId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer"
                required
              >
                <option value="">Choose employee...</option>
                {staff.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role.replace('-', ' ')})</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="shiftDateInput" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Shift Date
              </label>
              <input
                id="shiftDateInput"
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
                required
              />
            </div>

            {/* Start */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="startInput" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Start Time
              </label>
              <input
                id="startInput"
                type="time"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
                required
              />
            </div>

            {/* End */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="endInput" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                End Time
              </label>
              <input
                id="endInput"
                type="time"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800"
                required
              />
            </div>

          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-[10px] font-black uppercase text-neutral-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
            >
              Confirm Shift
            </button>
          </div>
        </form>
      )}

      {/* Shifts Agenda Table */}
      {shifts.length > 0 ? (
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200">
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Staff Name</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Shift Timing</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Shift Conflicts</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Fulfillment State</th>
                <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {shifts.map((sh) => {
                const conflict = getConflictWarning(sh.staffId, sh.date, sh.id, sh.startTime, sh.endTime);
                
                return (
                  <tr key={sh.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="p-4 text-xs font-bold text-neutral-800 text-left">{getStaffName(sh.staffId)}</td>
                    <td className="p-4 text-left">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-neutral-400" />
                        <span className="text-xs font-semibold text-neutral-600">
                          {sh.date} · {sh.startTime} - {sh.endTime}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      {conflict ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                          <AlertCircle size={9} /> Conflict
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          <CheckCircle2 size={9} /> No Conflict
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-left">
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                        sh.status === 'clocked-in' || sh.status === 'clocked-out' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        sh.status === 'late' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                        'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}>
                        {sh.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => deleteShift(sh.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            No Shifts Scheduled
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1">
            Create shift timings and assign them to employees to populate weekly schedules.
          </p>
        </Card>
      )}

    </div>
  );
};

export default ShiftScheduler;
