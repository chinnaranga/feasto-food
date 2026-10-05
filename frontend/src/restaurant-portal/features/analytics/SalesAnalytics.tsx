import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export const SalesAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Category sales bar breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Horizontal Bar chart */}
        <Card className="lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Sales by Menu Category</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Top-selling menu categories by gross billing revenue.</p>
          </div>

          <div className="space-y-3.5">
            {/* Sushi */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Special Sushi Rolls</span>
                <span>₹80,500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/40">
                <div className="h-full rounded-full bg-[#e35205]" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Rice Bowls */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Rice Bowls & Mains</span>
                <span>₹60,000</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/40">
                <div className="h-full rounded-full bg-[#e35205]" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Drinks */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Cold Beverages</span>
                <span>₹24,500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/40">
                <div className="h-full rounded-full bg-[#e35205]" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Desserts */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-neutral-700">
                <span>Matcha Desserts</span>
                <span>₹19,500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200/40">
                <div className="h-full rounded-full bg-[#e35205]" style={{ width: '19%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Payment breakdowns donut chart */}
        <Card className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider font-heading">Payment Channels</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Billing payment methods breakdown share.</p>
          </div>

          <div className="flex items-center justify-center p-3 relative h-32">
            <svg className="w-24 h-24" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f1f1" strokeWidth="3" />
              
              {/* Segment 1: Cards (55%) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#e35205"
                strokeWidth="3.2"
                strokeDasharray="55 45"
                strokeDashoffset="25"
              />
              
              {/* Segment 2: UPI (35%) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.2"
                strokeDasharray="35 65"
                strokeDashoffset="-30"
              />
              
              {/* Segment 3: Cash (10%) */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth="3.2"
                strokeDasharray="10 90"
                strokeDashoffset="-65"
              />
            </svg>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e35205]" />
                <span>Credit Cards</span>
              </div>
              <span className="font-bold text-neutral-800">55%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>UPI Payments</span>
              </div>
              <span className="font-bold text-neutral-800">35%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a3a3a3]" />
                <span>Cash Drawer</span>
              </div>
              <span className="font-bold text-neutral-800">10%</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Sales category AI tips */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Sales Optimizer</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            UPI checkout methods have surged by 25% this cycle. Offering quick-pay QR prompts on registrar desks can lower average cashier queue times.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SalesAnalytics;
