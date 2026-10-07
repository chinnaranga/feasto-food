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
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-left font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#141518] text-[#D7F04A] border border-[#141518] font-mono font-black text-xl flex items-center justify-center shadow-[3px_3px_0px_#141518]">
            {personalInfo.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-black text-[#141518] uppercase tracking-wider">
                {personalInfo.fullName}
              </h2>
              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
                VERIFIED
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#141518] block">
              {personalInfo.riderCode} • ★ 4.92 SLA
            </span>
            <span className="text-[11px] text-[#55565B] block font-mono">{personalInfo.phone}</span>
          </div>
        </div>

        {/* Readiness Progress Ring */}
        <div className="text-right">
          <span className="text-2xl font-black font-mono text-[#141518] block leading-none px-2 py-1 bg-[#D7F04A] border border-[#141518]">
            {readinessPct}%
          </span>
          <span className="text-[9px] font-bold uppercase text-[#55565B] font-mono block mt-1">
            READINESS SLA
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── ProfileSubNavTabBar ─────────────────────────────────────────────────────
export const ProfileSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'HUB', path: '/rider/profile' },
    { label: 'EDIT DOSSIER', path: '/rider/profile/edit' },
    { label: 'CONTACT', path: '/rider/profile/contact' },
    { label: 'VEHICLE RC', path: '/rider/profile/vehicle' },
    { label: 'DOCUMENTS', path: '/rider/profile/documents' },
    { label: 'SHIFTS', path: '/rider/profile/availability' },
    { label: 'ZONE RADIUS', path: '/rider/profile/service-area' },
    { label: 'PREFERENCES', path: '/rider/profile/preferences' },
    { label: 'BANK PAYOUT', path: '/rider/profile/payout' },
    { label: 'READINESS SLA', path: '/rider/profile/readiness' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/profile'}
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

// ─── VehicleCard ─────────────────────────────────────────────────────────────
export const VehicleCard: React.FC<{ vehicle: RiderVehicleSetup }> = ({ vehicle }) => {
  return (
    <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 text-left font-mono">
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#D7F04A] text-[#141518] border border-[#141518]">
            <Bike size={18} />
          </div>
          <div>
            <h4 className="text-xs font-heading font-black text-[#141518] uppercase tracking-wider">
              {vehicle.brandModel}
            </h4>
            <span className="text-[11px] text-[#55565B] font-mono">{vehicle.plateNumber}</span>
          </div>
        </div>
        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
          ● ACTIVE FLEET
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-[#F3F0E8] border border-[#141518]">
          <span className="text-[10px] text-[#55565B] font-bold uppercase block">FLEET CLASS</span>
          <span className="font-bold text-[#141518]">EV BATTERY PROPULSION (+GREEN BONUS)</span>
        </div>
        <div className="p-2.5 bg-[#F3F0E8] border border-[#141518]">
          <span className="text-[10px] text-[#55565B] font-bold uppercase block">INSURANCE VALID</span>
          <span className="font-bold text-[#141518]">{vehicle.insuranceExpiryDate}</span>
        </div>
      </div>
    </div>
  );
};

// ─── DocumentCard ────────────────────────────────────────────────────────────
export const DocumentCard: React.FC<{ doc: RiderDocumentAuditItem }> = ({ doc }) => {
  const statusStyles = {
    approved: 'bg-[#D7F04A] text-[#141518] border-[#141518]',
    under_review: 'bg-[#FEF08A] text-[#141518] border-[#141518]',
    submitted: 'bg-[#BFDBFE] text-[#141518] border-[#141518]',
    action_needed: 'bg-[#FEE2E2] text-[#991B1B] border-[#141518]',
    expired: 'bg-[#E9D5FF] text-[#581C87] border-[#141518]',
  };

  return (
    <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] flex items-center justify-between text-left text-xs font-mono">
      <div className="space-y-0.5">
        <strong className="text-[#141518] font-bold block uppercase">{doc.title}</strong>
        <span className="text-[11px] text-[#55565B] font-mono block">
          NO: {doc.docNumber} {doc.expiryDate ? `• EXP: ${doc.expiryDate}` : ''}
        </span>
      </div>
      <span
        className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border shadow-[1px_1px_0px_#141518] ${
          statusStyles[doc.status]
        }`}
      >
        {doc.status.replace('_', ' ')}
      </span>
    </div>
  );
};

// ─── SaveChangesBar ──────────────────────────────────────────────────────────
export const SaveChangesBar: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto p-3 z-[300] font-mono">
      <div className="p-3 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#D7F04A]" />
          <span>Unsaved courier modifications pending.</span>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-[#D7F04A] hover:bg-[#cbf130] text-[#141518] font-mono font-black uppercase tracking-wider border border-[#141518] transition-colors cursor-pointer shadow-[2px_2px_0px_#141518]"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};
