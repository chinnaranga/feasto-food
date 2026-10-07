import React, { useState } from 'react';
import { UserCheck, Clock, UserX, Sun, Sparkles, CheckSquare, Square } from 'lucide-react';
import usePortalStaffStore from '../../store/portalStaffStore';
import Card from '../../components/ui/Card';

export const AttendanceTracker: React.FC = () => {
  const { staff, shifts, clockInStaff, updateAttendance } = usePortalStaffStore();

  const [activeShiftId, setActiveShiftId] = useState<string>('');
  const [isLateOption, setIsLateOption] = useState<boolean>(false);

  // Filter scheduled shifts for clock-in simulation
  const clockableShifts = shifts.filter((s) => s.status === 'scheduled');

  const handleClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShiftId) return;

    const shift = shifts.find((s) => s.id === activeShiftId);
    if (!shift) return;

    clockInStaff(shift.staffId, shift.id, isLateOption);
    setActiveShiftId('');
    setIsLateOption(false);
  };

  const getStaffName = (staffId: string) => {
    return staff.find((m) => m.id === staffId)?.name || 'Unknown Staff';
  };

  // Stats
  const presentStaffCount = staff.filter((s) => s.attendance === 'present').length;
  const lateStaffCount = staff.filter((s) => s.attendance === 'late').length;
  const onLeaveStaffCount = staff.filter((s) => s.attendance === 'on-leave').length;

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Attendance Roster & Clock-In Hub</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Monitor real-time clock-in actions, track late arrivals, and simulate employee check-in times.
        </p>
      </div>

      {/* Attendance Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Present */}
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <UserCheck size={18} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-neutral-400 uppercase">Present On Station</h5>
            <p className="text-lg font-black text-neutral-800 mt-0.5">{presentStaffCount} active</p>
          </div>
        </Card>

        {/* Late */}
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-neutral-400 uppercase">Late Arrivals</h5>
            <p className="text-lg font-black text-neutral-800 mt-0.5">{lateStaffCount} employee</p>
          </div>
        </Card>

        {/* Leaves */}
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-50 text-neutral-400 flex items-center justify-center border border-neutral-200 shrink-0">
            <UserX size={18} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-neutral-400 uppercase">On Authorized Leave</h5>
            <p className="text-lg font-black text-neutral-800 mt-0.5">{onLeaveStaffCount} logged</p>
          </div>
        </Card>
      </div>

      {/* Clock In Simulation tool */}
      {clockableShifts.length > 0 ? (
        <form onSubmit={handleClockInSubmit} className="p-5 border border-neutral-200 bg-neutral-50/50 rounded-2xl space-y-4">
          <div className="flex items-center gap-1.5 border-b border-[#141518]/10 pb-2">
            <Sparkles size={13} className="text-[#1B3BFF]" />
            <h5 className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider font-mono">
              Simulate Employee Clock-In Terminal
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end font-mono">
            {/* Scheduled shift select */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="shiftClockSelect" className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">
                Select Scheduled Shift
              </label>
              <select
                id="shiftClockSelect"
                value={activeShiftId}
                onChange={(e) => setActiveShiftId(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs font-semibold text-[#141518] cursor-pointer"
                required
              >
                <option value="">Choose shift...</option>
                {clockableShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getStaffName(s.staffId)} ({s.date} · {s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Late Option */}
            <div className="flex items-center gap-2 h-10 select-none cursor-pointer" onClick={() => setIsLateOption(!isLateOption)}>
              {isLateOption ? (
                <CheckSquare size={16} className="text-[#1B3BFF]" />
              ) : (
                <Square size={16} className="text-[#52555F]/40" />
              )}
              <span className="text-xs font-bold text-[#52555F]">Mark check-in as Late Arrival</span>
            </div>

            <button
              type="submit"
              className="py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer h-9 flex items-center justify-center gap-1.5"
            >
              <Sun size={12} />
              <span>Simulate Clock-In</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/20 text-center italic text-xs text-neutral-400">
          All scheduled shifts have clock-in transactions logged.
        </div>
      )}

      {/* Attendance summary list */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Staff Name</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Role</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Daily Status</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Manual Action override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {staff.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-50/30 transition-colors">
                <td className="p-4 text-xs font-bold text-neutral-800 text-left">{m.name}</td>
                <td className="p-4 text-xs font-semibold text-neutral-500 uppercase text-left">{m.role.replace('-', ' ')}</td>
                <td className="p-4 text-left">
                  <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                    m.attendance === 'present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    m.attendance === 'late' ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                    m.attendance === 'on-leave' ? 'bg-neutral-50 text-neutral-400 border-neutral-200' :
                    'bg-neutral-50 text-neutral-400 border-neutral-100'
                  }`}>
                    {m.attendance}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    {(['present', 'late', 'on-leave'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateAttendance(m.id, status)}
                        className={`px-2 py-1 text-[8px] font-mono font-bold uppercase border cursor-pointer transition-colors ${
                          m.attendance === status
                            ? 'bg-[#141518] text-[#D7F04A] border-[#141518] shadow-[2px_2px_0px_#141518]'
                            : 'bg-[#FAF8F5] text-[#52555F] border-[#141518]/20 hover:border-[#141518]'
                        }`}
                      >
                        {status.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AttendanceTracker;
