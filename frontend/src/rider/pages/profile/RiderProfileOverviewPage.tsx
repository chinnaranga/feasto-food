import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bike, FileText, Clock, MapPin, Sliders, CreditCard, ShieldCheck } from 'lucide-react';
import useRiderProfileStore from '../../store/useRiderProfileStore';
import { VehicleCard, DocumentCard } from '../../components/profile/RiderProfileComponents';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderProfileOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { personalInfo, vehicle, documents, availability, serviceArea, payout, readiness } =
    useRiderProfileStore();

  const shortcuts = [
    { label: 'Edit Personal Details', path: '/rider/profile/edit', icon: <User size={16} /> },
    { label: 'Manage Vehicle & RC', path: '/rider/profile/vehicle', icon: <Bike size={16} /> },
    { label: 'Document Verification', path: '/rider/profile/documents', icon: <FileText size={16} /> },
    { label: 'Shift Schedules', path: '/rider/profile/availability', icon: <Clock size={16} /> },
    { label: 'Service Zone Preferences', path: '/rider/profile/service-area', icon: <MapPin size={16} /> },
    { label: 'Delivery Preferences', path: '/rider/profile/preferences', icon: <Sliders size={16} /> },
    { label: 'Bank & UPI Payouts', path: '/rider/profile/payout', icon: <CreditCard size={16} /> },
    { label: 'Readiness Audit', path: '/rider/profile/readiness', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="COURIER DOSSIER HUB"
        subtitle="Operational profile configurations, vehicle fleet setup, compliance papers, and duty preferences."
      />

      {/* Quick Action Menu Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
        {shortcuts.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="p-3.5 bg-[#FAF8F5] border border-[#141518] shadow-[2px_2px_0px_#141518] text-left hover:bg-[#F3F0E8] transition-colors space-y-1.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <div className="p-1.5 bg-[#D7F04A] text-[#141518] border border-[#141518] w-fit">
              {item.icon}
            </div>
            <strong className="text-[#141518] uppercase text-xs font-bold block">{item.label}</strong>
          </button>
        ))}
      </div>

      {/* Active Vehicle Preview */}
      <VehicleCard vehicle={vehicle} />

      {/* Compliance Document Audit Sample */}
      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-[#141518]/15 pb-2">
          <h4 className="text-xs font-heading font-black text-[#141518] uppercase tracking-wider">
            COMPLIANCE PAPERS STATUS
          </h4>
          <button
            onClick={() => navigate('/rider/profile/documents')}
            className="text-xs font-mono font-bold text-[#141518] underline underline-offset-4 decoration-[#D7F04A] decoration-2 hover:text-[#1B3BFF] cursor-pointer uppercase"
          >
            VIEW ALL ({documents.length}) →
          </button>
        </div>

        <div className="space-y-2">
          {documents.slice(0, 2).map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderProfileOverviewPage;
