import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ArrowRight, Download, RefreshCw } from 'lucide-react';
import usePortalFinanceStore from '../../store/portalFinanceStore';

export const BillingView: React.FC = () => {
  const { subscription, invoices } = usePortalFinanceStore();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>(subscription.billingCycle);

  const PLAN_TIERS = [
    {
      name: 'Growth Merchant',
      monthlyPrice: 2499,
      annualPrice: 23990,
      description: 'Essential portal features for single-location restaurants',
      features: ['Up to 3 Staff Accounts', 'Standard KDS & Order Hub', 'Basic Menu Management', 'Standard Email Support'],
      isCurrent: subscription.planTier === 'Growth',
    },
    {
      name: 'Pro Merchant',
      monthlyPrice: 4999,
      annualPrice: 47990,
      description: 'Advanced analytics, inventory stock automation, and unlimited team seats',
      features: ['Unlimited Staff Seats & Roles', 'Multi-Branch Support', 'Stock & Waste Tracking', 'Real-time AI Financial Audits', 'Priority 24/7 Phone Support'],
      isCurrent: subscription.planTier === 'Pro Merchant',
      isPopular: true,
    },
    {
      name: 'Enterprise Custom',
      monthlyPrice: 9999,
      annualPrice: 95990,
      description: 'Custom API access, dedicated account manager, and custom ERP integration',
      features: ['Custom POS & ERP Webhooks', 'Dedicated Support Manager', 'SLA 99.99% Uptime Guarantee', 'Custom Audit Reports & Export'],
      isCurrent: subscription.planTier === 'Enterprise',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Current Active Plan Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#e35205] text-white">
              {subscription.planTier}
            </span>
            <span className="text-xs text-neutral-400 font-bold">● Active Subscription</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Feasto Restaurant Portal — {subscription.planTier}
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            Your workspace is currently enrolled in the {subscription.planTier} tier. Your next automatic renewal billing date is{' '}
            <strong className="text-white">{subscription.nextBillingDate}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => alert('Billing settings updated. Invoice receipts will be dispatched to ' + subscription.billingEmail)}
            className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            Update Billing Email
          </button>
        </div>
      </div>

      {/* Grid: Payment Method & Billing Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method Card */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-[#e35205]" />
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                Default Payment Method
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-150 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-neutral-900 text-white font-black text-[10px] flex items-center justify-center tracking-wider">
                {subscription.paymentMethod.cardBrand.toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-black text-neutral-800 block">
                  •••• •••• •••• {subscription.paymentMethod.last4}
                </span>
                <span className="text-[10px] text-neutral-400">
                  Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                </span>
              </div>
            </div>
            <button
              onClick={() => alert('Opening secure Stripe payment method update portal...')}
              className="text-[10px] font-bold text-[#e35205] hover:text-[#c94804] cursor-pointer"
            >
              Replace
            </button>
          </div>
        </div>

        {/* Billing Alerts & Notification Settings */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
                Billing Security & Alerts
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-neutral-600">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <span>Automatic Invoice Receipt Email</span>
              <span className="font-bold text-emerald-600">Enabled ({subscription.billingEmail})</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <span>Failed Payment Retries</span>
              <span className="font-bold text-neutral-800">Auto 3x Smart Retry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Tiers Comparison & Upgrade Readiness */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Available Subscription Tiers
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select an option below to adjust your merchant portal scale and feature limits
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex p-0.5 bg-neutral-100 rounded-xl border border-neutral-200 self-start sm:self-auto">
            <button
              onClick={() => setSelectedCycle('monthly')}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                selectedCycle === 'monthly' ? 'bg-white text-neutral-800 shadow-3xs' : 'text-neutral-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setSelectedCycle('annual')}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                selectedCycle === 'annual' ? 'bg-white text-neutral-800 shadow-3xs' : 'text-neutral-500'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-2xl bg-white border text-left flex flex-col justify-between transition-all duration-200 ${
                tier.isCurrent
                  ? 'border-[#e35205] shadow-md shadow-orange-100/50 relative'
                  : 'border-neutral-200/80 hover:border-neutral-300 shadow-2xs'
              }`}
            >
              <div>
                {tier.isCurrent && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#e35205] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-3xs">
                    Current Active Plan
                  </span>
                )}
                <h4 className="text-sm font-black text-neutral-900">{tier.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-1 min-h-[32px] leading-relaxed">
                  {tier.description}
                </p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-neutral-900">
                    ₹
                    {selectedCycle === 'monthly'
                      ? tier.monthlyPrice.toLocaleString('en-IN')
                      : Math.round(tier.annualPrice / 12).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold">/ month</span>
                </div>

                <ul className="mt-4 space-y-2 pt-4 border-t border-neutral-100 text-xs">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                {tier.isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 bg-neutral-100 text-neutral-500 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Upgrading workspace plan to ${tier.name}...`)}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-3xs"
                  >
                    Switch to {tier.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingView;
