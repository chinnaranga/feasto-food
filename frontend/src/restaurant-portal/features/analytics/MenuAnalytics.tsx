import React from 'react';
import { Award, Sparkles, TrendingDown, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';

export const MenuAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Metrics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Highest gross margin */}
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <DollarSign size={18} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-neutral-400 uppercase">Highest Gross Margin Item</h5>
            <p className="text-sm font-black text-neutral-800 mt-0.5">Matcha Mochi Cups (82%)</p>
          </div>
        </Card>

        {/* Slowest mover */}
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-650 flex items-center justify-center border border-red-100 shrink-0">
            <TrendingDown size={18} className="text-red-500" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-neutral-400 uppercase">Slowest Mover (Low Vol)</h5>
            <p className="text-sm font-black text-neutral-800 mt-0.5">Oolong Black Tea (2 sales/30D)</p>
          </div>
        </Card>

      </div>

      {/* Menu rankings grid */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Top Selling Dish</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Category</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Orders Count</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Average Price</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Gross Margin</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            {/* Row 1 */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Spicy Crunch Salmon Roll</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 uppercase text-left">Sushi Rolls</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">120 sales</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">₹750</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">70%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">₹90,000</td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Avocado Dragon Special</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 uppercase text-left">Sushi Rolls</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">85 sales</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">₹650</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">65%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">₹55,250</td>
            </tr>

            {/* Row 3 */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Matcha Cream Swirl</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 uppercase text-left">Desserts</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">48 sales</td>
              <td className="p-4 text-xs font-bold text-neutral-700 text-left">₹250</td>
              <td className="p-4 text-left">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">82%</span>
              </td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">₹12,000</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI menu tips */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Menu Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            "Matcha Cream Swirl" has extremely high gross margins (82%). Suggest bundling it with "Spicy Crunch Salmon Roll" combo platters to lift average billing totals by 12%.
          </p>
        </div>
      </div>

    </div>
  );
};

export default MenuAnalytics;
