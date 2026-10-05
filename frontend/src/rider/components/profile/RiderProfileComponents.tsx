import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  User,
  Bike,
  FileText,
  Clock,
  MapPin,
  Sliders,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Save,
  PauseCircle,
  Sparkles,
} from 'lucide-react';
import type {
  RiderPersonalInfo,
  RiderVehicleSetup,
  RiderDocumentAuditItem,
  RiderAvailabilitySetup,
  RiderServiceArea,
  RiderDeliveryPreferences,
  RiderPayoutSetup,
  RiderOperationalReadiness,
} from '../../types/profile';
import { RiderButton } from '../RiderUIComponents';

// ─── ProfileHeader ───────────────────────────────────────────────────────────
export const ProfileHeader: React.FC<{
  personalInfo: RiderPersonalInfo;
  readinessPct: number;
}> = ({ personalInfo, readinessPct }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white font-heading font-black text-xl flex items-center justify-center shadow-3xs">
            {personalInfo.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-neutral-900 font-heading">{personalInfo.fullName}</h2>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#e35205] block">
              {personalInfo.riderCode} • ★ 4.92 Rating
            </span>
            <span className="text-[11px] text-neutral-500 block font-mono">{personalInfo.phone}</span>
          </div>
        </div>

        {/* Readiness Progress Ring */}
        <div className="text-right">
          <span className="text-2xl font-black font-mono text-emerald-700 block leading-none">
            {readinessPct}%
          </span>
          <span className="text-[9px] font-bold uppercase text-neutral-400 font-heading block mt-1">
            Readiness SLA
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── ProfileSubNavTabBar ─────────────────────────────────────────────────────
export const ProfileSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Hub', path: '/rider/profile' },
    { label: 'Edit Info', path: '/rider/profile/edit' },
    { label: 'Contact', path: '/rider/profile/contact' },
    { label: 'Vehicle', path: '/rider/profile/vehicle' },
    { label: 'Documents', path: '/rider/profile/documents' },
    { label: 'Availability', path: '/rider/profile/availability' },
    { label: 'Service Area', path: '/rider/profile/service-area' },
    { label: 'Preferences', path: '/rider/profile/preferences' },
    { label: 'Payout', path: '/rider/profile/payout' },
    { label: 'Readiness Audit', path: '/rider/profile/readiness' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/profile'}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

// ─── VehicleCard ─────────────────────────────────────────────────────────────
export const VehicleCard: React.FC<{ vehicle: RiderVehicleSetup }> = ({ vehicle }) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#e35205]/10 text-[#e35205]">
            <Bike size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 font-heading">{vehicle.brandModel}</h4>
            <span className="text-[11px] text-neutral-500 font-mono">{vehicle.plateNumber}</span>
          </div>
        </div>
        <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● Active Vehicle
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block">Fuel / EV Type</span>
          <span className="font-bold text-neutral-900">EV Battery Pack</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block">Insurance Valid Till</span>
          <span className="font-bold text-neutral-900">{vehicle.insuranceExpiryDate}</span>
        </div>
      </div>
    </div>
  );
};

// ─── DocumentCard ────────────────────────────────────────────────────────────
export const DocumentCard: React.FC<{ doc: RiderDocumentAuditItem }> = ({ doc }) => {
  const statusStyles = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    under_review: 'bg-amber-50 text-amber-700 border-amber-200',
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    action_needed: 'bg-red-50 text-red-700 border-red-200',
    expired: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-between text-left text-xs">
      <div className="space-y-0.5">
        <strong className="text-neutral-900 font-bold block">{doc.title}</strong>
        <span className="text-[11px] text-neutral-500 font-mono block">
          No: {doc.docNumber} {doc.expiryDate ? `• Expires: ${doc.expiryDate}` : ''}
        </span>
      </div>
      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
        {doc.status.replace('_', ' ')}
      </span>
    </div>
  );
};

// ─── SaveChangesBar ──────────────────────────────────────────────────────────
export const SaveChangesBar: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto p-3 z-[300]">
      <div className="p-3 bg-neutral-900 text-white rounded-2xl shadow-modal flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#e35205]" />
          <span>You have unsaved profile changes.</span>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
