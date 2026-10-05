import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export const BranchAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Overview rankings table */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left w-12">Rank</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Branch Name</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Gross Revenue</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Order Volume</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Avg Fulfillment</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">#1</td>
              <td className="p-4 text-xs font-bold text-[#e35205] text-left">Downtown Flagship Store</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">₹1,20,000</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">980 orders</td>
              <td className="p-4 text-xs font-bold text-neutral-750 text-left">6.8 mins</td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">85% capacity</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">#2</td>
              <td className="p-4 text-xs font-bold text-neutral-750 text-left">Suburbs Cloud Kitchen</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">₹64,500</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">500 orders</td>
              <td className="p-4 text-xs font-bold text-neutral-750 text-left">7.8 mins</td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">45% capacity</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Branch Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Downtown Flagship store operates at 85% capacity during weekend lunch slots. Shifting 15% of delivery order scopes to the Suburbs cloud kitchen will lower overall wait times.
          </p>
        </div>
      </div>

    </div>
  );
};

export default BranchAnalytics;
