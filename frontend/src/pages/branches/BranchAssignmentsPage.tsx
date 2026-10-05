import React, { useState } from 'react';
import { Users, Plus, Shield, CheckCircle2, UserPlus } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';

export const BranchAssignmentsPage: React.FC = () => {
  const { branches, selectedBranchId, staffAssignments, assignStaffToBranch, removeStaffAssignment } =
    usePortalBranchesStore();

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState<'head_chef' | 'branch_manager' | 'cashier' | 'kitchen_line' | 'runner'>('kitchen_line');
  const [shiftSchedule, setShiftSchedule] = useState('Morning (09:00 - 18:00)');

  const activeBranchId = selectedBranchId !== 'all' ? selectedBranchId : branches[0].id;
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const assignedStaff = staffAssignments.filter((sa) => sa.branchId === activeBranch.id);

  const handleAssignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName) return;
    assignStaffToBranch({
      staffId: `st-${Date.now()}`,
      staffName,
      role,
      branchId: activeBranch.id,
      isPrimaryBranch: true,
      shiftSchedule,
    });
    setStaffName('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              👥 Location Staffing & Scope Management
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Staff & Menu Scoping for {activeBranch.name}
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Assign shift personnel, kitchen managers, line chefs, and specify branch-level menu availability overrides.
          </p>
        </div>

        <button
          onClick={() => setShowAddStaffModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <UserPlus size={13} />
          <span>Assign Staff Member</span>
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider font-heading">
          Assigned Shift Personnel ({assignedStaff.length})
        </h4>

        {assignedStaff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignedStaff.map((sa) => (
              <div key={sa.staffId} className="p-4 rounded-xl bg-neutral-50 border border-neutral-150 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-xs font-black text-neutral-900 block font-heading">{sa.staffName}</strong>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono">{sa.role.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Primary
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">Shift: {sa.shiftSchedule}</div>
                <div className="pt-2 border-t border-neutral-200 flex justify-end">
                  <button
                    onClick={() => removeStaffAssignment(sa.staffId, activeBranch.id)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Unassign
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-150 text-xs text-neutral-500">
            No staff assigned to this outlet yet. Click "Assign Staff Member" to add personnel.
          </div>
        )}
      </div>

      {/* Assign Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignStaff}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-md w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Assign Staff Member to Outlet</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Staff Full Name</label>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Rahul Kapoor"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-neutral-700 block">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
              >
                <option value="branch_manager">Branch Manager</option>
                <option value="head_chef">Head Chef</option>
                <option value="cashier">Billing Cashier</option>
                <option value="kitchen_line">Kitchen Line Cook</option>
                <option value="runner">Order Dispatch Runner</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-neutral-700 block">Shift Schedule</label>
              <select
                value={shiftSchedule}
                onChange={(e) => setShiftSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
              >
                <option value="Morning (09:00 - 18:00)">Morning (09:00 - 18:00)</option>
                <option value="Evening (14:00 - 23:00)">Evening (14:00 - 23:00)</option>
                <option value="Full Day (11:00 - 22:00)">Full Day (11:00 - 22:00)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Assign Staff
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BranchAssignmentsPage;
