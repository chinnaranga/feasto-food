import React from 'react';
import { RotateCcw, CheckCircle2, XCircle, AlertTriangle, Clock, Filter, HelpCircle } from 'lucide-react';
import usePortalFinanceStore, { RefundRecord } from '../../store/portalFinanceStore';

export const RefundsView: React.FC = () => {
  const { refunds, approveRefund, rejectRefund } = usePortalFinanceStore();

  const totalRefundedAmount = refunds
    .filter((r) => r.status === 'processed' || r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingRefunds = refunds.filter((r) => r.status === 'requested');

  return (
    <div className="space-y-6 text-left">
      {/* Overview Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Approved Refunds
          </span>
          <h3 className="text-2xl font-black text-neutral-900">
            ₹{totalRefundedAmount.toLocaleString('en-IN')}
          </h3>
          <span className="text-[10px] text-neutral-400">Deducted from gross payout settlements</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Pending Refund Requests
          </span>
          <h3 className="text-2xl font-black text-amber-600">{pendingRefunds.length} Requests</h3>
          <span className="text-[10px] text-neutral-400">Awaiting merchant manager review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Refund Rate Ratio
          </span>
          <h3 className="text-2xl font-black text-emerald-600">0.82%</h3>
          <span className="text-[10px] text-neutral-400">Well below platform 2.5% threshold</span>
        </div>
      </div>

      {/* Refunds Tracking Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Guest Refund Request Queue
          </h3>
          <span className="text-[10px] font-bold text-neutral-400">SLA: Review within 24 hours</span>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Refund Type</th>
                  <th className="py-3 px-4">Reason Category</th>
                  <th className="py-3 px-4">Requested Time</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">{ref.orderId}</td>
                    <td className="py-3.5 px-4 text-neutral-800">{ref.customerName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          ref.type === 'full'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {ref.type} Refund
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-neutral-600">
                      {ref.reason.replace(/-/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                      {new Date(ref.requestedAt).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-neutral-900">
                      ₹{ref.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          ref.status === 'processed' || ref.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ref.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ref.status === 'requested' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveRefund(ref.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectRefund(ref.id)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-normal">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundsView;
