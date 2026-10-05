import React from 'react';
import { Bell, Sparkles, Shield } from 'lucide-react';
import { RiderPageHeader } from '../components/RiderUIComponents';

export const RiderNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Rider Alerts & System Updates" subtitle="Notifications on incentives, zone shifts, and safety." />
      <div className="space-y-2 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <Sparkles size={14} className="text-[#e35205]" />
            <span>Weekend Peak Quest Bonus Activated</span>
          </div>
          <p className="text-neutral-500">Complete 10 deliveries between 18:00 and 22:00 to earn an extra ₹250 bonus payout.</p>
          <span className="text-[10px] text-neutral-400 font-mono block">2 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default RiderNotificationsPage;
