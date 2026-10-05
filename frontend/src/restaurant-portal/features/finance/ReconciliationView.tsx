import React, { useState } from 'react';
import { GitCompare, AlertTriangle, CheckCircle2, RefreshCw, HelpCircle, ArrowUpRight, Search } from 'lucide-react';
import usePortalFinanceStore, { ReconciliationItem } from '../../store/portalFinanceStore';

export const ReconciliationView: React.FC = () => {
  const { reconciliation, resolveReconciliation } = usePortalFinanceStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const filteredItems = reconciliation.filter((item) => {
    if (filterStatus === 'matched') return item.status === 'matched';
    if (filterStatus === 'unreconciled') return item.status === 'unreconciled';
    if (filterStatus === 'discrepancy') return item.status === 'discrepancy-flagged';
    return true;
  });

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      resolveReconciliation(selectedItem.id, resolutionNotes || 'Manually verified and cleared by merchant finance team.');
      setSelectedItem(null);
      setResolutionNotes('');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Automated Gateway Matching
            </span>
            <span className="text-xs text-neutral-400 font-bold">Stripe · Razorpay · Paytm</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Order Transaction Reconciliation Hub
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Automatically matches POS order records with bank deposit entries to detect gateway fee leaks, missing payouts, and timing mismatches.
          </p>
        </div>

        <button
          onClick={() => alert('Initiating real-time gateway transaction re-sync with bank records...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs shrink-0"
        >
          <RefreshCw size={13} />
          <span>Re-Sync Gateways</span>
        </button>
      </div>

      {/* Reconciliation Table & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'discrepancy', label: 'Discrepancies' },
              { id: 'unreconciled', label: 'Unreconciled' },
              { id: 'matched', label: 'Matched' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-neutral-900 text-white shadow-3xs'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Payment Gateway</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Expected (₹)</th>
                  <th className="py-3 px-4 text-right">Settled (₹)</th>
                  <th className="py-3 px-4 text-right">Discrepancy</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-black text-neutral-900">{item.orderId}</td>
                    <td className="py-3.5 px-4 text-neutral-800">{item.paymentGateway}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{item.transactionDate}</td>
                    <td className="py-3.5 px-4 text-right text-neutral-700">
                      ₹{item.expectedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-700">
                      ₹{item.settledAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.discrepancy !== 0 ? (
                        <span className="text-red-600 font-black">
                          {item.discrepancy < 0 ? '-' : '+'}₹
                          {Math.abs(item.discrepancy).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">₹0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.status === 'matched'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'discrepancy-flagged'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status !== 'matched' ? (
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-normal">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Resolution Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 text-left border border-neutral-200">
            <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider font-heading">
              Resolve Order Discrepancy — {selectedItem.orderId}
            </h3>

            <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Expected Amount:</span>
                <span className="font-bold text-neutral-800">₹{selectedItem.expectedAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Settled Amount:</span>
                <span className="font-bold text-neutral-800">₹{selectedItem.settledAmount}</span>
              </div>
              <div className="flex justify-between text-red-600 font-black pt-1 border-t border-neutral-200">
                <span>Discrepancy:</span>
                <span>₹{selectedItem.discrepancy}</span>
              </div>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Resolution & Audit Note *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="State reason for manual resolution (e.g. Gateway fee correction, bank delay confirmed)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                >
                  Clear & Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReconciliationView;
