import React from 'react';
import { Wheat, Sparkles, TrendingDown, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';

export const InventoryAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Overview statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Expired Stock Loss</h5>
          <p className="text-lg font-black text-neutral-800">₹8,200</p>
          <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-bold">-4% YoY improvement</span>
        </Card>
        
        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Safety Margin Breaches</h5>
          <p className="text-lg font-black text-neutral-800">12 times</p>
          <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-bold">Frequent for Avocado Hass</span>
        </Card>

        <Card className="p-4 space-y-1">
          <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Stock Turnover Index</h5>
          <p className="text-lg font-black text-neutral-800">8.4x / month</p>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">Healthy stock rotation</span>
        </Card>
      </div>

      {/* Roster reorder frequency */}
      <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-neutral-200">
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Stock Material</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Average Reorder Freq</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-left">Lead Time</th>
              <th className="p-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Cost Per Dish Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Fresh Atlantic Salmon</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Every 3 days</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 text-left">2 days lead</td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">High (35% of roll cost)</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Premium Sushi Rice</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Every 14 days</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 text-left">5 days lead</td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">Low (5% of roll cost)</td>
            </tr>

            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-4 text-xs font-bold text-neutral-800 text-left">Haas Avocado (Ripe)</td>
              <td className="p-4 text-xs text-neutral-500 font-semibold text-left">Every 2 days</td>
              <td className="p-4 text-xs font-semibold text-neutral-500 text-left">1 day lead</td>
              <td className="p-4 text-xs font-black text-neutral-800 text-right">Medium (12% of roll cost)</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* AI suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Waste Suggestion</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Avocado Haas spoils on average 15% faster during monsoon humidity. We suggest reducing preferred reorder quantity bounds by 10% during rainy forecast weeks.
          </p>
        </div>
      </div>

    </div>
  );
};

export default InventoryAnalytics;
