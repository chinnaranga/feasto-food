import React from 'react';
import { Wallet, TrendingUp, Sparkles, CreditCard, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import useRiderEarningsStore from '../../store/useRiderEarningsStore';
import { WalletCard } from '../../components/earnings/RiderEarningsComponents';
import { RiderPageHeader } from '../../components/RiderUIComponents';

export const RiderEarningsTodayPage: React.FC = () => {
  const { summary, wallet, trips, aiInsight, setTransferModalOpen } = useRiderEarningsStore();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
            Rider Financial & Earnings Portal
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Real-time shift earnings summary, itemized order payouts, and instant bank settlements.
          </p>
        </div>

        <button
          onClick={() => setTransferModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs flex items-center gap-2 w-fit"
        >
          <CreditCard size={15} />
          <span>Withdraw ₹{wallet.availableBalance.toFixed(0)} to Bank →</span>
        </button>
      </div>

      {/* 4-Column Metric Card Grid Across Top */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono text-left">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Today's Net Total</span>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 leading-none">₹{summary.todayTotal.toFixed(0)}</h4>
          <span className="text-[11px] text-emerald-700 font-bold block pt-1">{summary.completedTripsCount} Deliveries</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Trip Base Pay</span>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 leading-none">₹{summary.basePayTotal}</h4>
          <span className="text-[11px] text-neutral-500 block pt-1">Distance & Time</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Customer Tips</span>
          <h4 className="text-xl sm:text-2xl font-black text-emerald-700 leading-none">+₹{summary.customerTipsTotal}</h4>
          <span className="text-[11px] text-emerald-700 font-bold block pt-1">100% Direct Payout</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-black uppercase text-neutral-400 font-heading">Quest & Surge Bonuses</span>
          <h4 className="text-xl sm:text-2xl font-black text-[#e35205] leading-none">+₹{summary.surgeBonusTotal}</h4>
          <span className="text-[11px] text-[#e35205] font-bold block pt-1">Peak Rewards</span>
        </div>
      </div>

      {/* Main 2-Column Split Layout (7 cols Trip Table + 5 cols Wallet & AI Forecast on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itemized Trip Payout Breakdown Table (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-xs font-black uppercase text-neutral-900 font-heading">
                Today's Itemized Order Payout Audit
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono block">Order-by-order breakdown</span>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <strong className="text-neutral-900 font-bold text-sm block">{trip.orderNumber}</strong>
                    <span className="text-[11px] text-neutral-500 block">{trip.restaurantName} • ₹{trip.distancePay} Dist Pay</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-neutral-900 font-bold text-base block">₹{trip.netPay.toFixed(2)}</strong>
                    <span className="text-[10px] text-neutral-400 block">{trip.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-600">
                  <span>Base: ₹{trip.basePay}</span>
                  <span>Tip: ₹{trip.tipAmount}</span>
                  <span className="text-[#e35205] font-bold">Surge: ₹{trip.surgeBonus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Wallet Card & AI Telemetry (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <WalletCard wallet={wallet} onOpenTransfer={() => setTransferModalOpen(true)} />

          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#e35205]" />
                <h3 className="text-xs font-black uppercase text-neutral-900 font-heading">AI Earnings Telemetry</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Forecast: ₹{aiInsight.forecastedWeeklyEarnings}
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">{aiInsight.bonusOptimizationTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderEarningsTodayPage;
