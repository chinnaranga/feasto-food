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
  const steps: { id: DeliveryStage; label: string; code: string }[] = [
    { id: 'accepted', label: 'ASSIGNED', code: '01' },
    { id: 'en_route_to_pickup', label: 'TO KITCHEN', code: '02' },
    { id: 'arrived_at_pickup', label: 'AT PASS', code: '03' },
    { id: 'picked_up', label: 'COLLECTED', code: '04' },
    { id: 'en_route_to_drop', label: 'IN TRANSIT', code: '05' },
    { id: 'arrived_at_drop', label: 'AT DOOR', code: '06' },
    { id: 'delivered', label: 'DELIVERED', code: '07' },
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
    <div className="w-full bg-[#FAF8F5] border-b border-[#141518] px-4 py-3 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-2.5 min-w-max">
        {steps.map((s, idx) => {
          const sIndex = stageOrder.indexOf(s.id);
          const isDone = currentIndex > sIndex;
          const isCurrent = currentStage === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-[#141518] ${
                    isDone
                      ? 'bg-[#141518] text-[#FAF8F5]'
                      : isCurrent
                      ? 'bg-[#D7F04A] text-[#141518] shadow-[2px_2px_0px_#141518]'
                      : 'bg-[#F3F0E8] text-[#55565B]'
                  }`}
                >
                  {isDone ? '✓' : s.code}
                </span>
                <span
                  className={`text-[11px] uppercase tracking-wider ${
                    isCurrent
                      ? 'text-[#141518] font-black underline underline-offset-4 decoration-[#D7F04A] decoration-2'
                      : isDone
                      ? 'text-[#141518] font-bold'
                      : 'text-[#55565B]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && <span className="text-[#141518]/30 text-xs">→</span>}
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
    { label: 'MISSION HUD', path: '/rider/active' },
    { label: 'PICKUP PROTOCOL', path: '/rider/active/pickup' },
    { label: 'DROP-OFF', path: '/rider/active/delivery' },
    { label: 'ROUTE MATRIX', path: '/rider/active/route' },
    { label: 'STAGE PROGRESSION', path: '/rider/active/status' },
    { label: 'REPORT EXCEPTION', path: '/rider/active/exceptions' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/active'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#FAF8F5] border-transparent text-[#55565B] hover:text-[#141518] hover:bg-[#F3F0E8] hover:border-[#141518]/20'
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
    accepted: '1. COMMENCE ROUTE TO RESTAURANT',
    en_route_to_pickup: '2. CONFIRM ARRIVAL AT KITCHEN',
    arrived_at_pickup: '3. VERIFY & CONFIRM CARGO COLLECTED',
    picked_up: '4. COMMENCE ROUTE TO CUSTOMER',
    en_route_to_drop: '5. CONFIRM ARRIVAL AT CUSTOMER DESTINATION',
    arrived_at_drop: '6. VERIFY OTP & COMPLETE DROP-OFF',
    delivered: '✓ MISSION COMPLETED',
    failed: 'MISSION FAILED',
    returned: 'MISSION RETURNED',
  };

  return (
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-left font-mono">
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black text-[#55565B] uppercase">
              {task.orderNumber}
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518] shadow-[1px_1px_0px_#141518]">
              ACTIVE FULFILLMENT
            </span>
          </div>
          <h3 className="text-base font-heading font-black text-[#141518] uppercase tracking-tight">
            {task.restaurantName}
          </h3>
        </div>

        <div className="text-right">
          <span className="text-xl font-black text-[#141518] font-mono block px-2.5 py-1 bg-[#D7F04A] border border-[#141518]">
            ₹{totalPayout.toFixed(0)}
          </span>
          <span className="text-[10px] text-[#55565B] font-mono block mt-1 uppercase">
            INCL. ₹{task.tipAmount} TIP
          </span>
        </div>
      </div>

      {/* Route Addresses */}
      <div className="space-y-2.5 text-xs text-[#141518]">
        <div className="p-3 bg-[#F3F0E8] border border-[#141518] flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">PICKUP KITCHEN</span>
            <strong className="text-[#141518] block">{task.restaurantAddress}</strong>
          </div>
          <a
            href={`tel:${task.restaurantPhone}`}
            className="p-2 bg-[#FAF8F5] text-[#141518] border border-[#141518] hover:bg-[#D7F04A] transition-colors shadow-[2px_2px_0px_#141518]"
          >
            <Phone size={14} />
          </a>
        </div>

        <div className="p-3 bg-[#F3F0E8] border border-[#141518] flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#55565B] uppercase block">DROP-OFF DESTINATION</span>
            <strong className="text-[#141518] block">{task.customerName} ({task.dropoffAddress})</strong>
          </div>
          <a
            href={`tel:${task.customerPhone}`}
            className="p-2 bg-[#FAF8F5] text-[#141518] border border-[#141518] hover:bg-[#D7F04A] transition-colors shadow-[2px_2px_0px_#141518]"
          >
            <Phone size={14} />
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
    <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 text-left font-mono">
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-2">
        <h4 className="text-xs font-black uppercase text-[#141518] tracking-wider">
          CARGO INSPECTION CHECKLIST
        </h4>
        <span className="text-[10px] font-black px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
          {items.filter((i) => i.isChecked).length} / {items.length} VERIFIED
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-3 border flex items-center justify-between text-xs cursor-pointer transition-all ${
              item.isChecked
                ? 'bg-[#D7F04A]/25 border-[#141518] text-[#141518] font-bold shadow-[2px_2px_0px_#141518]'
                : 'bg-[#F3F0E8] border-[#141518]/30 text-[#141518] hover:border-[#141518]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={14} className={item.isChecked ? 'text-[#141518]' : 'text-[#55565B]'} />
              <span>{item.itemName} (x{item.quantity})</span>
            </div>
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => {}}
              className="accent-[#141518]"
            />
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
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-[#FAF8F5] border border-[#141518] p-6 shadow-[6px_6px_0px_#141518] space-y-4 text-left z-10 font-mono">
        <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
          <h3 className="text-sm font-heading font-black text-[#141518] uppercase">
            REPORT DISPATCH EXCEPTION
          </h3>
          <button
            onClick={onClose}
            className="p-1 border border-[#141518] bg-[#FAF8F5] hover:bg-[#F3F0E8] text-[#141518]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-[#141518] uppercase block text-[11px]">
            INCIDENT CATEGORY
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] shadow-[2px_2px_0px_#141518]"
          >
            <option value="restaurant_delay">Restaurant Preparation Delay</option>
            <option value="customer_unavailable">Customer Not Answering Call</option>
            <option value="address_issue">Delivery Address Unreachable / Road Block</option>
            <option value="item_issue">Food Bag Broken / Seal Compromised</option>
            <option value="vehicle_breakdown">Vehicle Breakdown / Flat Tyre Emergency</option>
          </select>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-[#141518] uppercase block text-[11px]">
            TELEMETRY & LOG DETAILS
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe incident for dispatch control intervention..."
            className="w-full p-3 bg-[#FAF8F5] border border-[#141518] text-xs font-mono text-[#141518] focus:outline-none shadow-[2px_2px_0px_#141518]"
          />
        </div>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            CANCEL
          </RiderButton>
          <RiderButton variant="danger" fullWidth onClick={() => onConfirmReport(type, notes)}>
            TRANSMIT REPORT
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
