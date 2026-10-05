import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, AlertTriangle } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { PickupChecklist } from '../../components/active/RiderActiveComponents';
import { RiderButton, RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActivePickupPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTask, toggleChecklistItem, advanceStage, setReportIssueModalOpen } = useRiderActiveStore();

  if (!activeTask) {
    return <RiderEmptyState title="No Active Delivery" description="Accept a job offer to begin pickup workflow." />;
  }

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Restaurant Pickup Workflow" subtitle={activeTask.restaurantName} />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Pickup Location</span>
          <span className="text-emerald-700 font-mono font-bold">SLA: {activeTask.pickupSlaTime}</span>
        </div>

        <div className="space-y-1">
          <strong className="text-neutral-900 block text-sm">{activeTask.restaurantName}</strong>
          <span className="text-neutral-600 block">{activeTask.restaurantAddress}</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <a
            href={`tel:${activeTask.restaurantPhone}`}
            className="flex-1 py-2 px-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone size={14} />
            <span>Call Restaurant</span>
          </a>
          <button
            onClick={() => setReportIssueModalOpen(true)}
            className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <AlertTriangle size={14} />
            <span>Report Delay</span>
          </button>
        </div>
      </div>

      {/* Checklist */}
      <PickupChecklist items={activeTask.itemsList} onToggleItem={toggleChecklistItem} />

      <RiderButton variant="primary" size="lg" fullWidth onClick={advanceStage}>
        Confirm Items Picked Up & Depart →
      </RiderButton>
    </div>
  );
};

export default RiderActivePickupPage;
