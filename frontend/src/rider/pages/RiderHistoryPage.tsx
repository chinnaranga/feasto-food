import React from 'react';
import { RiderPageHeader, RiderEmptyState } from '../components/RiderUIComponents';

export const RiderHistoryPage: React.FC = () => {
  return (
    <div className="space-y-4 text-left">
      <RiderPageHeader title="Completed Delivery History" subtitle="Audit log of completed courier trips and customer ratings." />
      <div className="space-y-2">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 text-xs space-y-1">
          <div className="flex justify-between font-mono font-bold">
            <span>#1807 • La Pasta Bella</span>
            <span className="text-emerald-700">₹95</span>
          </div>
          <span className="text-neutral-500 block">Completed today at 15:42 • 3.2 km</span>
          <span className="text-amber-600 font-bold block">★ 5.0 Rating</span>
        </div>
      </div>
    </div>
  );
};

export default RiderHistoryPage;
