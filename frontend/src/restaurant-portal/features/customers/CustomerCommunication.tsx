import React from 'react';
import { Share2, Mail, Phone, MessageSquare, Sparkles, CheckSquare, Clock } from 'lucide-react';
import usePortalCustomerStore from '../../store/portalCustomerStore';
import Card from '../../components/ui/Card';

export const CustomerCommunication: React.FC = () => {
  const { customers } = usePortalCustomerStore();

  // Stats calculation
  const total = customers.length;
  const emailConsent = customers.filter((c) => c.consent.email).length;
  const smsConsent = customers.filter((c) => c.consent.sms).length;
  const whatsappConsent = customers.filter((c) => c.consent.whatsapp).length;

  const emailPct = total > 0 ? Math.round((emailConsent / total) * 100) : 0;
  const smsPct = total > 0 ? Math.round((smsConsent / total) * 100) : 0;
  const whatsappPct = total > 0 ? Math.round((whatsappConsent / total) * 100) : 0;

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-3">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">Communication & Marketing Consent</h4>
        <p className="text-xs text-neutral-400 mt-0.5">Track outreach eligibility ratios across email, SMS, and messaging networks.</p>
      </div>

      {/* Ratios Metrics Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#e35205]" />
              <span className="text-xs font-black text-neutral-800">Email Campaign</span>
            </div>
            <span className="text-xs font-black text-emerald-600">{emailPct}% opt-in</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${emailPct}%` }} />
          </div>
          <span className="text-[9px] text-neutral-400 font-semibold block">{emailConsent} of {total} guests reachable</span>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#e35205]" />
              <span className="text-xs font-black text-neutral-800">SMS Notifications</span>
            </div>
            <span className="text-xs font-black text-emerald-600">{smsPct}% opt-in</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#e35205] h-full rounded-full" style={{ width: `${smsPct}%` }} />
          </div>
          <span className="text-[9px] text-neutral-400 font-semibold block">{smsConsent} of {total} guests reachable</span>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#e35205]" />
              <span className="text-xs font-black text-neutral-800">WhatsApp Chat</span>
            </div>
            <span className="text-xs font-black text-neutral-500">{whatsappPct}% opt-in</span>
          </div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${whatsappPct}%` }} />
          </div>
          <span className="text-[9px] text-neutral-400 font-semibold block">{whatsappConsent} of {total} guests reachable</span>
        </Card>

      </div>

      {/* Timezone and language distribution stats */}
      <div className="border border-neutral-200/80 rounded-2xl p-5 bg-white shadow-3xs text-xs space-y-4">
        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-heading">Timing & Dispatch Preferences</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Target Delivery Window</span>
            <div className="space-y-1.5 font-semibold text-neutral-600">
              <div className="flex justify-between items-center">
                <span>Morning (09:00 - 12:00)</span>
                <span className="font-bold text-neutral-700">20% of users</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lunch Slots (12:00 - 15:00)</span>
                <span className="font-bold text-[#e35205]">40% of users</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Evening Slots (18:00 - 21:00)</span>
                <span className="font-bold text-[#e35205]">40% of users</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Language Distributions</span>
            <div className="space-y-1.5 font-semibold text-neutral-600">
              <div className="flex justify-between items-center">
                <span>English (default)</span>
                <span className="font-bold text-neutral-700">80% of users</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Regional Languages</span>
                <span className="font-bold text-neutral-700">20% of users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Timing Suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Outreach Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Guests in the Downtown segment are 4x more likely to open email campaigns on Wednesday mornings at 11:15 AM. We recommend scheduling office combo offer campaigns during this exact window.
          </p>
        </div>
      </div>

    </div>
  );
};

export default CustomerCommunication;
