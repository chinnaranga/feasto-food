import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, Download, CheckCircle2, Building2, ShoppingBag, ShieldCheck } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';

export const PayoutDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payouts } = usePortalFinanceStore();

  const payout = payouts.find((p) => p.id === id) || payouts[0];

  if (!payout) {
    return <div className="py-12 text-center text-neutral-400 font-bold text-xs">Payout record not found.</div>;
  }

  const { breakdown } = payout;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/restaurant-portal/finance/payouts')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Payouts List</span>
        </button>

        <button
          onClick={() => alert(`Exporting settlement breakdown for ${payout.payoutNumber} (CSV/PDF)...`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-3xs"
        >
          <Download size={13} />
          <span>Export Settlement Sheet</span>
        </button>
      </div>

      {/* Payout Summary Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-neutral-800 font-heading">{payout.payoutNumber}</span>
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  payout.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {payout.status}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Settlement Date: <strong className="text-neutral-700">{payout.settlementDate}</strong> · Branch:{' '}
              <strong className="text-neutral-700">{payout.branchName}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
              NET BANK DEPOSIT
            </span>
            <span className="text-2xl font-black text-emerald-600">₹{payout.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Deductions Breakdown Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            Settlement Deductions & Charges Waterfall
          </h4>

          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-150 space-y-2.5 text-xs">
            <div className="flex justify-between font-bold text-neutral-800">
              <span>Gross Order Sales ({payout.orderCount} orders)</span>
              <span>₹{breakdown.grossSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>+ Packaging Fees Collected</span>
              <span>+₹{breakdown.packagingFeeCollected.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>+ GST Tax Collected</span>
              <span>+₹{breakdown.taxCollected.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-600 pt-2 border-t border-neutral-200">
              <span>- Feasto Platform Commission (10%)</span>
              <span>-₹{breakdown.platformCommission.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>- Payment Gateway Processing Charges (2%)</span>
              <span>-₹{breakdown.gatewayFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>- Delivery Partner Logistics Fee</span>
              <span>-₹{breakdown.deliveryPartnerFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-300">
              <span>Final Net Payout Transfer</span>
              <span className="text-emerald-600">₹{breakdown.netSettlement.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Bank Confirmation Details */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Transferred via HDFC Bank NEFT to Account ending in ****{payout.bankAccountLast4}</span>
          </div>
          <span className="font-bold text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-emerald-200">
            UTRN: HDFC202677189021
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetailView;
