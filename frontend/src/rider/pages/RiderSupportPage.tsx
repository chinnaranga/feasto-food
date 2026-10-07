import React from 'react';
import { PhoneCall, ShieldAlert, MessageSquare } from 'lucide-react';
import { RiderPageHeader, RiderButton } from '../components/RiderUIComponents';

export const RiderSupportPage: React.FC = () => {
  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="EMERGENCY SUPPORT & SOS HELPLINE"
        subtitle="24/7 priority operations hotline for road accidents, roadside assistance, and customer disputes."
      />

      <div className="p-6 bg-[#FEE2E2] border border-[#141518] shadow-[4px_4px_0px_#141518] text-[#991B1B] space-y-3.5">
        <div className="flex items-center gap-2.5 font-heading font-black text-base uppercase tracking-wider text-[#991B1B]">
          <ShieldAlert size={20} className="text-[#991B1B]" />
          <span>IMMEDIATE EMERGENCY SOS PROTOCOL</span>
        </div>
        <p className="text-xs text-[#7F1D1D] leading-relaxed font-sans">
          If you are facing an active medical emergency, vehicle collision, or road hazard during a mission,
          tap below to instantly connect to Feasto 24/7 Rapid Response & Ambulance Dispatch.
        </p>
        <a
          href="tel:+9118002009999"
          className="w-full py-3.5 bg-[#EF4444] hover:bg-[#dc2626] text-white font-mono font-bold text-xs uppercase tracking-wider border border-[#141518] shadow-[3px_3px_0px_#141518] flex items-center justify-center gap-2 cursor-pointer transition-colors active:translate-x-[1px] active:translate-y-[1px]"
        >
          <PhoneCall size={16} />
          <span>CALL 24/7 EMERGENCY SOS HOTLINE</span>
        </a>
      </div>
    </div>
  );
};

export default RiderSupportPage;
