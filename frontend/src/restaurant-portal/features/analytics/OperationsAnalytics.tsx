import React from 'react';
import { Clock, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';

export const OperationsAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Overview statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Average Prep Time</h5>
          <p className="text-lg font-black text-neutral-800">7.2 mins</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">-1.5m WoW</span>
        </Card>
        
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Fulfillment Bottleneck</h5>
          <p className="text-lg font-black text-neutral-800">Assembly station</p>
          <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-bold">3.1m average delay</span>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Late Dispatch Rate</h5>
          <p className="text-lg font-black text-neutral-800">1.2%</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Optimal levels</span>
        </Card>
      </div>

      {/* Roster stations lists */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Kitchen Station</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Fulfillment Speed</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Peak Load Status</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Error Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Cold Salad & Raw Prep Bar</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">4.1 mins average</td>
              <td className="p-4 text-left">
                <span className="inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-250">Optimal</span>
              </td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-right">0.2%</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Hot Grill & Deep Frying Station</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">9.8 mins average</td>
              <td className="p-4 text-left">
                <span className="inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-250">Load warning</span>
              </td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-right">1.8%</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Final Assembly & Packaging Bar</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">3.1 mins average</td>
              <td className="p-4 text-left">
                <span className="inline-flex px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-250">Optimal</span>
              </td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-right">0.5%</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI ops suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Operations Suggestion</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Hot Grill station speeds drop to 12.5 mins during Friday evening dinner rushes. We suggest adding a backup cook shift starting at 18:00 to balance peak load queues.
          </p>
        </div>
      </div>

    </div>
  );
};

export default OperationsAnalytics;
