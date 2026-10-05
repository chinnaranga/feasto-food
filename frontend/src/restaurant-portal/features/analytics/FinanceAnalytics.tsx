import React from 'react';
import { DollarSign, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export const FinanceAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gross Sales Revenue</h5>
          <p className="text-lg font-black text-neutral-800">₹2,02,700</p>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Discount Campaigns</h5>
          <p className="text-lg font-black text-red-650">-₹18,200</p>
          <span className="text-[9px] text-neutral-400 font-semibold leading-normal">Promo campaigns impact</span>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Net Sales Revenue</h5>
          <p className="text-lg font-black text-neutral-800">₹1,84,500</p>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gross Profit Margin</h5>
          <p className="text-lg font-black text-emerald-600">68%</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Stable margins</span>
        </Card>

      </div>

      {/* Roster fees breakdowns */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Financial Ledger</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Gross Value</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Net Ratio</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Tax Liabilities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Food Roster Sales</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">₹1,64,000</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">88.8%</td>
              <td className="p-4 text-xs font-black text-neutral-850 text-right">₹8,200</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Beverages Roster Sales</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">₹20,500</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">11.2%</td>
              <td className="p-4 text-xs font-black text-neutral-850 text-right">₹1,025</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Delivery & Packaging Fees</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">₹18,200</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">--</td>
              <td className="p-4 text-xs font-black text-neutral-850 text-right">₹910</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI finance suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Margin Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Discount campaign "50% Off Lunch Special" has reduced overall gross profit margins by 6% during weekdays. We suggest switching to flat rate value combos.
          </p>
        </div>
      </div>

    </div>
  );
};

export default FinanceAnalytics;
