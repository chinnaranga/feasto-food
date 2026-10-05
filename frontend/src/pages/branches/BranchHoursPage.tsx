import React, { useState } from 'react';
import { Clock, Plus, AlertTriangle } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { HoursCard } from './BranchComponents';

export const BranchHoursPage: React.FC = () => {
  const { branches, selectedBranchId, branchHours, specialClosures, addSpecialClosure } =
    usePortalBranchesStore();

  const [showClosureModal, setShowClosureModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState<'holiday' | 'renovation' | 'staff_training' | 'weather' | 'emergency'>('holiday');

  const activeBranchId = selectedBranchId !== 'all' ? selectedBranchId : branches[0].id;
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const hours = branchHours[activeBranchId] || [];
  const closures = specialClosures[activeBranchId] || [];

  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;
    addSpecialClosure(activeBranchId, {
      title,
      startDate,
      endDate: endDate || startDate,
      reason,
      affectsDelivery: true,
      affectsPickup: true,
    });
    setTitle('');
    setShowClosureModal(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🕒 Store, Kitchen & Delivery Schedule
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Operating Hours & Holiday Schedule for {activeBranch.name}
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Specify opening hours per day of week, kitchen preparation windows, order cutoff slots, and special holiday closures.
          </p>
        </div>

        <button
          onClick={() => setShowClosureModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <Plus size={13} />
          <span>Add Special Closure</span>
        </button>
      </div>

      {/* Hours Card View */}
      <HoursCard
        hours={hours}
        closures={closures}
        onAddClosure={() => setShowClosureModal(true)}
      />

      {/* Add Special Closure Modal */}
      {showClosureModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddClosure}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-md w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Add Scheduled Special Closure</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Closure Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep Cleaning & Hood Inspection"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-neutral-700 block">Closure Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
              >
                <option value="holiday">Public Holiday</option>
                <option value="renovation">Kitchen Renovation</option>
                <option value="staff_training">Staff Training</option>
                <option value="weather">Severe Weather</option>
                <option value="emergency">Emergency Closure</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Save Closure
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BranchHoursPage;
