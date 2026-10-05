import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Navigation,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import type { DeliveryStage, ActiveDeliveryTask, PickupChecklistItem, DeliveryException } from '../../types/active';
import { RiderButton } from '../RiderUIComponents';

// ─── StatusStepper ───────────────────────────────────────────────────────────
export const StatusStepper: React.FC<{ currentStage: DeliveryStage }> = ({ currentStage }) => {
  const steps: { id: DeliveryStage; label: string }[] = [
    { id: 'accepted', label: 'Accepted' },
    { id: 'en_route_to_pickup', label: 'To Pickup' },
    { id: 'arrived_at_pickup', label: 'At Pickup' },
    { id: 'picked_up', label: 'Picked Up' },
    { id: 'en_route_to_drop', label: 'To Drop' },
    { id: 'arrived_at_drop', label: 'At Customer' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const stageOrder: DeliveryStage[] = [
    'accepted',
    'en_route_to_pickup',
    'arrived_at_pickup',
    'picked_up',
    'en_route_to_drop',
    'arrived_at_drop',
    'delivered',
  ];

  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full bg-white border-b border-neutral-200/80 px-4 py-2.5 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-2 min-w-max">
        {steps.map((s, idx) => {
          const sIndex = stageOrder.indexOf(s.id);
          const isDone = currentIndex > sIndex;
          const isCurrent = currentStage === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#e35205] text-white shadow-3xs'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-neutral-900 font-heading' : isDone ? 'text-emerald-700' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && <span className="text-neutral-300 text-xs">/</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─── ActiveSubNavTabBar ──────────────────────────────────────────────────────
export const ActiveSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Active Task', path: '/rider/active' },
    { label: 'Pickup Flow', path: '/rider/active/pickup' },
    { label: 'Delivery Drop', path: '/rider/active/delivery' },
    { label: 'Route Context', path: '/rider/active/route' },
    { label: 'Status Stepper', path: '/rider/active/status' },
    { label: 'Report Issue', path: '/rider/active/exceptions' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/active'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// ─── DeliveryFocusCard ───────────────────────────────────────────────────────
export const DeliveryFocusCard: React.FC<{
  task: ActiveDeliveryTask;
  onAdvance: () => void;
}> = ({ task, onAdvance }) => {
  const totalPayout = task.payoutAmount + task.tipAmount + task.surgeBonusAmount;

  const stageCTALabels: Record<DeliveryStage, string> = {
    accepted: '1. Start Route to Restaurant',
    en_route_to_pickup: '2. Confirm Arrived at Restaurant',
    arrived_at_pickup: '3. Confirm Items Picked Up',
    picked_up: '4. Start Route to Customer',
    en_route_to_drop: '5. Confirm Arrived at Customer',
    arrived_at_drop: '6. Complete Delivery & Handoff',
    delivered: '✓ Delivery Completed',
    failed: 'Delivery Failed',
    returned: 'Order Returned',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{task.orderNumber}</span>
            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#e35205]/10 text-[#e35205] border border-[#e35205]/20">
              Active Fulfillment
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">{task.restaurantName}</h3>
        </div>

        <div className="text-right">
          <span className="text-xl font-black text-emerald-700 font-mono block leading-none">
            ₹{totalPayout.toFixed(0)}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono block mt-1">Includes ₹{task.tipAmount} tip</span>
        </div>
      </div>

      {/* Route Addresses */}
      <div className="space-y-2.5 text-xs text-neutral-700">
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Pickup Location</span>
            <strong className="text-neutral-900 block">{task.restaurantAddress}</strong>
          </div>
          <a href={`tel:${task.restaurantPhone}`} className="p-2 rounded-xl bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100">
            <Phone size={15} />
          </a>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Dropoff Address</span>
            <strong className="text-neutral-900 block">{task.customerName} ({task.dropoffAddress})</strong>
          </div>
          <a href={`tel:${task.customerPhone}`} className="p-2 rounded-xl bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100">
            <Phone size={15} />
          </a>
        </div>
      </div>

      {/* Stage Action CTA */}
      <RiderButton variant="primary" size="lg" fullWidth onClick={onAdvance}>
        {stageCTALabels[task.currentStage]} →
      </RiderButton>
    </div>
  );
};

// ─── PickupChecklist ─────────────────────────────────────────────────────────
export const PickupChecklist: React.FC<{
  items: PickupChecklistItem[];
  onToggleItem: (id: string) => void;
}> = ({ items, onToggleItem }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">Restaurant Order Checklist</h4>
        <span className="text-[10px] font-mono font-bold text-emerald-700">
          {items.filter((i) => i.isChecked).length} / {items.length} Checked
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
              item.isChecked
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-bold'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={14} className={item.isChecked ? 'text-emerald-600' : 'text-neutral-400'} />
              <span>{item.itemName} (x{item.quantity})</span>
            </div>
            <input type="checkbox" checked={item.isChecked} onChange={() => {}} className="accent-emerald-600" />
          </label>
        ))}
      </div>
    </div>
  );
};

// ─── IssueReportModal ────────────────────────────────────────────────────────
export const IssueReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirmReport: (type: DeliveryException['type'], notes: string) => void;
}> = ({ isOpen, onClose, onConfirmReport }) => {
  const [type, setType] = useState<DeliveryException['type']>('restaurant_delay');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-modal space-y-4 text-left z-10">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-sm font-black text-neutral-900 font-heading">Report Active Delivery Issue</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Select Issue Category</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-none"
          >
            <option value="restaurant_delay">Restaurant Preparation Delay</option>
            <option value="customer_unavailable">Customer Not Responding to Call</option>
            <option value="address_issue">Delivery Address Incorrect / Unreachable</option>
            <option value="item_issue">Food Item Missing or Damaged</option>
            <option value="vehicle_breakdown">Vehicle Breakdown Emergency</option>
          </select>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-neutral-700 block">Additional Issue Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue for support team dispatch..."
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            Cancel
          </RiderButton>
          <RiderButton variant="danger" fullWidth onClick={() => onConfirmReport(type, notes)}>
            Submit Report
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
