import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export const StaffAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider"> Roster Clock-in Reliability</h5>
          <p className="text-lg font-black text-neutral-800">94.2%</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Stable performance</span>
        </Card>
        
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Shift Coverage Rate</h5>
          <p className="text-lg font-black text-neutral-800">98.0%</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Optimal levels</span>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Overtime logged</h5>
          <p className="text-lg font-black text-neutral-800">14.5 hrs</p>
          <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-bold">Over budget (+2.5 hrs)</span>
        </Card>
      </div>

      {/* Roster productivity rankings */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Staff Member</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Role Scope</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Shift Reliability</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Fulfillment throughput</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Sato Takeshi</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Store Manager</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">98%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">820 orders</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Tanaka Yoshi</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Kitchen Chef</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">95%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">1,200 orders</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Yamamoto Yumi</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Cashier</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">88%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">640 orders</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI staff suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Staffing Suggestion</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Yamamoto Yumi (Cashier) late clock-in frequency has hit 12% on morning shifts. We suggest shifting her schedule to afternoon slots.
          </p>
        </div>
      </div>

    </div>
  );
};

export default StaffAnalytics;
