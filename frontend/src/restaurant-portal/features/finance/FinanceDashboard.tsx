import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Landmark,
  FileText,
  Receipt,
  ShoppingBag,
  RotateCcw,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  AlertOctagon,
  CreditCard,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';
import FinanceCard from '../../components/ui/FinanceCard';
import FinancialInsightCard from '../../components/ui/FinancialInsightCard';

export const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { payouts, invoices, expenses, refunds, taxes, insights, subscription } = usePortalFinanceStore();

  const totalRevenue = payouts.reduce((sum, p) => sum + p.breakdown.grossSales, 0);
  const totalSettled = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payouts
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const totalOverdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRefunds = refunds.reduce((sum, r) => sum + r.amount, 0);
  const currentTaxCollected = taxes[1]?.totalTaxCollected || 24250;

  return (
    <div className="space-y-6 text-left">
      {/* Executive Quick Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceCard
          title="Gross Revenue (Period)"
          amount={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtitle="All processed customer orders"
          trend={{ value: '+14.2%', isPositive: true, label: 'vs previous period' }}
          icon={<DollarSign size={16} className="text-[#e35205]" />}
        />
        <FinanceCard
          title="Bank Payouts Settled"
          amount={`₹${totalSettled.toLocaleString('en-IN')}`}
          subtitle={`${payouts.filter((p) => p.status === 'completed').length} completed transfers`}
          badge={{ text: 'Settled', variant: 'success' }}
          icon={<Landmark size={16} className="text-emerald-600" />}
        />
        <FinanceCard
          title="Pending Settlements"
          amount={`₹${pendingPayouts.toLocaleString('en-IN')}`}
          subtitle="Arriving in next payout window"
          badge={{ text: 'In Transit', variant: 'warning' }}
          icon={<TrendingUp size={16} className="text-amber-600" />}
          action={{
            label: 'View Schedule',
            onClick: () => navigate('/restaurant-portal/finance/payouts'),
          }}
        />
        <FinanceCard
          title="GST Tax Collected"
          amount={`₹${currentTaxCollected.toLocaleString('en-IN')}`}
          subtitle="July 2026 tax filing period"
          badge={{ text: 'Ready', variant: 'brand' }}
          icon={<Receipt size={16} className="text-[#e35205]" />}
          action={{
            label: 'Review Return',
            onClick: () => navigate('/restaurant-portal/finance/taxes'),
          }}
        />
      </div>

      {/* AI Financial Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#e35205]" />
            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Financial Intelligence & Risk Alerts
            </h3>
          </div>
          <span className="text-[10px] font-bold text-neutral-400">Automated Audit Engine</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {insights.map((insight) => (
            <FinancialInsightCard
              key={insight.id}
              insight={insight}
              onAction={(ins) => {
                if (ins.type === 'margin-leak') navigate('/restaurant-portal/finance/reconciliation');
                else if (ins.type === 'anomaly') navigate('/restaurant-portal/finance/fees');
                else navigate('/restaurant-portal/finance/expenses');
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Operational Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoices & Payout Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Invoices Alert Card if present */}
          {overdueInvoices.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertOctagon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-900">
                    {overdueInvoices.length} Vendor Invoice{overdueInvoices.length > 1 ? 's' : ''} Overdue (₹
                    {totalOverdueAmount.toLocaleString('en-IN')})
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {overdueInvoices[0].entityName} is past due date ({overdueInvoices[0].dueDate}). Review to avoid vendor service interruptions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/restaurant-portal/finance/invoices')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0 shadow-3xs"
              >
                Resolve Invoices
              </button>
            </div>
          )}

          {/* Recent Payouts Progress Table */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                  Settlement & Payout Queue
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Automated net revenue transfers to merchant linked bank account
                </p>
              </div>
              <button
                onClick={() => navigate('/restaurant-portal/finance/payouts')}
                className="text-[11px] font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
              >
                All Payouts →
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  onClick={() => navigate(`/restaurant-portal/finance/payouts/${payout.id}`)}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50/60 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 shrink-0 font-black text-xs">
                      <Landmark size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-800">{payout.payoutNumber}</span>
                        <span className="text-[9px] font-semibold text-neutral-400">
                          {payout.orderCount} orders
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {payout.branchName} · Bank ****{payout.bankAccountLast4}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-neutral-900 block">
                      ₹{payout.amount.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                        payout.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : payout.status === 'processing'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {payout.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subscription Plan & Quick Actions */}
        <div className="space-y-6">
          {/* Active Subscription Status */}
          <div className="p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#e35205]">
                Portal Subscription
              </span>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ● Active Plan
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{subscription.planTier} Tier</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                ₹{subscription.monthlyFee.toLocaleString('en-IN')} / month · Billed {subscription.billingCycle}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-xs space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Next Billing Date:</span>
                <span className="text-white font-bold">{subscription.nextBillingDate}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Payment Method:</span>
                <span className="text-white font-bold">
                  {subscription.paymentMethod.cardBrand} ****{subscription.paymentMethod.last4}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/restaurant-portal/finance/billing')}
              className="w-full py-2 bg-[#e35205] hover:bg-[#c94804] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-3xs"
            >
              Manage Subscription Plan
            </button>
          </div>

          {/* Operational Expense Snapshot */}
          <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                Monthly Expenses Breakdown
              </h4>
              <button
                onClick={() => navigate('/restaurant-portal/finance/expenses')}
                className="text-[10px] font-bold text-[#e35205] cursor-pointer"
              >
                Log Expense
              </button>
            </div>

            <div className="text-2xl font-black text-neutral-900">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
              {expenses.slice(0, 3).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between text-neutral-600">
                  <span className="truncate max-w-[170px]">{exp.title}</span>
                  <span className="font-bold text-neutral-800">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
