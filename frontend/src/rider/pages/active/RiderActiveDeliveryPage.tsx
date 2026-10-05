import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useRiderActiveStore from '../../store/useRiderActiveStore';
import { RiderButton, RiderPageHeader, RiderEmptyState } from '../../components/RiderUIComponents';

export const RiderActiveDeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTask, completeActiveTask } = useRiderActiveStore();

  if (!activeTask) {
    return <RiderEmptyState title="No Active Delivery" description="Accept a job offer to view customer dropoff instructions." />;
  }

  const handleComplete = () => {
    completeActiveTask();
    navigate('/rider/dashboard');
  };

  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Customer Dropoff & Handoff" subtitle={`Deliver to ${activeTask.customerName}`} />

      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Dropoff Customer</span>
            <h4 className="text-sm font-black text-neutral-900 font-heading">{activeTask.customerName}</h4>
          </div>
          <a
            href={`tel:${activeTask.customerPhone}`}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 font-bold"
          >
            <Phone size={15} />
            <span>Call Customer</span>
          </a>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Delivery Address</span>
          <strong className="text-neutral-900 block text-sm">{activeTask.dropoffAddress}</strong>
        </div>

        {activeTask.specialInstructions && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <strong className="block font-bold">Safe Handoff Instructions:</strong>
            <p className="text-[11px] leading-relaxed">{activeTask.specialInstructions}</p>
          </div>
        )}

        <RiderButton variant="primary" size="lg" fullWidth onClick={handleComplete}>
          ✓ Complete Delivery & Collect ₹{(activeTask.payoutAmount + activeTask.tipAmount + activeTask.surgeBonusAmount).toFixed(0)}
        </RiderButton>
      </div>
    </div>
  );
};

export default RiderActiveDeliveryPage;
