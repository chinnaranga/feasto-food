import React from 'react';
import { PhoneCall, ShieldAlert, MessageSquare } from 'lucide-react';
import { RiderPageHeader, RiderButton } from '../components/RiderUIComponents';

export const RiderSupportPage: React.FC = () => {
  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Rider Support & Emergency Help" subtitle="24/7 helpline for road emergencies, accident assistance, and order issues." />

      <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
        <div className="flex items-center gap-2 font-black text-sm">
          <ShieldAlert size={18} className="text-red-600" />
          <span>Emergency SOS Support</span>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">
          If you are in an emergency or involved in a road incident, tap below to contact the 24/7 Rider Safety Response Team instantly.
        </p>
        <a
          href="tel:+9118002009999"
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-3xs"
        >
          <PhoneCall size={16} />
          <span>Call Emergency SOS Hotline</span>
        </a>
      </div>
    </div>
  );
};

export default RiderSupportPage;
