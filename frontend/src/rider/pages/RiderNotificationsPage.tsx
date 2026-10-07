import React from 'react';
import { Bell, Sparkles, Shield, Zap } from 'lucide-react';
import { RiderPageHeader } from '../components/RiderUIComponents';

export const RiderNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-4 text-left font-mono">
      <RiderPageHeader
        title="DISPATCH ALERTS & TELEMETRY"
        subtitle="Operational notices on surge quests, zone rebalancing, and fleet security."
      />
      <div className="space-y-3 text-xs font-mono">
        <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-1.5">
          <div className="flex items-center gap-2 font-black uppercase text-[#141518]">
            <div className="p-1 bg-[#D7F04A] border border-[#141518]">
              <Sparkles size={13} />
            </div>
            <span>WEEKEND PEAK SURGE QUEST ACTIVATED</span>
          </div>
          <p className="text-[#55565B] font-sans">
            Complete 10 deliveries between 18:00 and 22:00 in Bandra West to unlock an instant ₹250 direct cash bonus.
          </p>
          <span className="text-[10px] text-[#55565B] font-mono block">2 HOURS AGO · SYSTEM DISPATCH</span>
        </div>
      </div>
    </div>
  );
};

export default RiderNotificationsPage;
