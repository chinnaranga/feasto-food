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
    <div className="space-y-4 text-left">
      <RiderPageHeader
        title="Rider Operational Hub"
        subtitle="Manage your profile settings, active vehicle, compliance papers, and duty preferences."
      />

      {/* Quick Action Menu Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {shortcuts.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left hover:bg-neutral-50 transition-colors space-y-1.5 cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 w-fit">{item.icon}</div>
            <strong className="text-neutral-900 font-bold block">{item.label}</strong>
          </button>
        ))}
      </div>

      {/* Active Vehicle Preview */}
      <VehicleCard vehicle={vehicle} />

      {/* Compliance Document Audit Sample */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <h4 className="text-xs font-black text-neutral-900 font-heading uppercase">Compliance Documents Status</h4>
          <button onClick={() => navigate('/rider/profile/documents')} className="text-xs font-bold text-[#e35205]">
            View All ({documents.length}) →
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
