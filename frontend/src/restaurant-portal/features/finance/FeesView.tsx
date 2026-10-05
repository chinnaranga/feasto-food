import React, { useState } from 'react';
import { Percent, Info, HelpCircle, DollarSign, Calculator, ArrowUpRight } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';

export const FeesView: React.FC = () => {
  const { fees } = usePortalFinanceStore();

  // Interactive Fee Calculator State
  const [calcOrderVal, setCalcOrderVal] = useState<number>(1000);
  const [calcPackagingVal, setCalcPackagingVal] = useState<number>(40);

  const platformCommPct = 10; // 10%
  const gatewayFeePct = 2; // 2%
  const gstPct = 5; // 5% GST

  const calcCommAmt = Math.round(calcOrderVal * (platformCommPct / 100));
  const calcGatewayAmt = Math.round(calcOrderVal * (gatewayFeePct / 100));
  const calcGstAmt = Math.round(calcOrderVal * (gstPct / 100));
  const calcNetPayout = calcOrderVal + calcPackagingVal + calcGstAmt - calcCommAmt - calcGatewayAmt;

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-orange-50 text-[#e35205] border border-orange-200">
              ● Transparent Merchant Rates
            </span>
            <span className="text-xs text-neutral-400 font-bold">Standard Pro Merchant Tier</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Platform Commissions & Fee Structure Breakdown
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Audit exact percentage deductions on orders including Feasto platform commissions, gateway processing fees, packaging charges, and net payout margins.
          </p>
        </div>
      </div>

      {/* Grid: Fee Structure Cards & Interactive Net Revenue Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Commission Calculator */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-[#e35205]" />
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                Interactive Net Payout Margin Simulator
              </h3>
            </div>
            <span className="text-[10px] font-bold text-neutral-400">Live Commission Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Order Subtotal Amount (₹)
              </label>
              <input
                type="number"
                min="100"
                value={calcOrderVal}
                onChange={(e) => setCalcOrderVal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-black text-neutral-900 focus:outline-none focus:border-[#e35205]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Packaging Fee Collected (₹)
              </label>
              <input
                type="number"
                min="0"
                value={calcPackagingVal}
                onChange={(e) => setCalcPackagingVal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-black text-neutral-900 focus:outline-none focus:border-[#e35205]"
              />
            </div>
          </div>

          {/* Deductions Simulation Result Box */}
          <div className="p-5 rounded-xl bg-neutral-900 text-white space-y-3 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Customer Order Subtotal:</span>
              <span className="text-white font-bold">₹{calcOrderVal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>+ Packaging Charge:</span>
              <span className="text-white font-bold">+₹{calcPackagingVal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>+ GST Collected (5%):</span>
              <span className="text-white font-bold">+₹{calcGstAmt.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-400 pt-2 border-t border-neutral-800">
              <span>- Platform Commission (10%):</span>
              <span>-₹{calcCommAmt.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>- Payment Gateway Fee (2%):</span>
              <span>-₹{calcGatewayAmt.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-neutral-700">
              <span>Estimated Merchant Bank Payout:</span>
              <span className="text-[#e35205]">₹{calcNetPayout.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Standard Fee Schedule Reference */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Contracted Fee Rates
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Platform Commission
              </span>
              <div className="flex justify-between font-black text-neutral-900 text-sm">
                <span>10.0%</span>
                <span className="text-neutral-500 font-normal text-xs">Per Order</span>
              </div>
              <p className="text-[10px] text-neutral-400">Applies to subtotal sales after dish discounts</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Payment Gateway Fee
              </span>
              <div className="flex justify-between font-black text-neutral-900 text-sm">
                <span>2.0%</span>
                <span className="text-neutral-500 font-normal text-xs">UPI / Card / NetBanking</span>
              </div>
              <p className="text-[10px] text-neutral-400">Covers PCI-DSS card processing & UPI clearance</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Packaging Fee Share
              </span>
              <div className="flex justify-between font-black text-neutral-900 text-sm">
                <span>100% Retained</span>
                <span className="text-emerald-600 font-bold text-xs">0% Commission</span>
              </div>
              <p className="text-[10px] text-neutral-400">100% of packaging charges pass directly to merchant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesView;
