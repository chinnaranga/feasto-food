import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowUpRight, Clock, CheckCircle2, AlertTriangle, ChevronRight, Building2 } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';

export const PayoutsView: React.FC = () => {
  const navigate = useNavigate();
  const { payouts } = usePortalFinanceStore();

  const totalSettled = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payouts.filter((p) => p.status === 'pending' || p.status === 'processing');
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header & Upcoming Payout Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Automated Bank Settlement
            </span>
            <span className="text-xs text-neutral-400 font-bold">HDFC Bank ****8819</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Upcoming Payout: ₹{totalPendingAmount.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            Net revenue cleared from customer orders across all active branches. Scheduled for automatic NEFT deposit on{' '}
            <strong className="text-white">Tomorrow, July 22, 2026 at 06:00 AM</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert('Opening HDFC Bank Settlement Account Management...')}
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            Bank Account Settings
          </button>
        </div>
      </div>

      {/* Payouts Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Settlement & Payout History
          </h3>
          <span className="text-[10px] font-bold text-neutral-400">T+1 Daily Settlement Cycle</span>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">Payout #</th>
                  <th className="py-3 px-4">Branch Context</th>
                  <th className="py-3 px-4">Settlement Date</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Gross Sales</th>
                  <th className="py-3 px-4 text-right">Commission & Fees</th>
                  <th className="py-3 px-4 text-right">Net Bank Payout</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {payouts.map((payout) => {
                  const feesTotal =
                    payout.breakdown.platformCommission +
                    payout.breakdown.gatewayFee +
                    payout.breakdown.deliveryPartnerFee;
                  return (
                    <tr
                      key={payout.id}
                      onClick={() => navigate(`/restaurant-portal/finance/payouts/${payout.id}`)}
                      className="hover:bg-neutral-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-black text-neutral-900">
                        {payout.payoutNumber}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-800">{payout.branchName}</td>
                      <td className="py-3.5 px-4 text-neutral-500">{payout.settlementDate}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-800">
                        {payout.orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-right text-neutral-500">
                        ₹{payout.breakdown.grossSales.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-red-600 font-bold">
                        -₹{feesTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-neutral-900 text-sm">
                        ₹{payout.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            payout.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : payout.status === 'processing'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutsView;
