import React from 'react';
import { PiggyBank, Truck, Tag, CreditCard } from 'lucide-react';
import { useSavingsSummary } from '@/hooks/loyalty/useSavingsSummary';

export const SavingsSummaryCard: React.FC = () => {
  const { savings, totalSaved } = useSavingsSummary();

  const metrics = [
    {
      label: 'Free Delivery Savings',
      amount: savings.deliveryFeesSaved,
      icon: <Truck size={14} className="text-blue-500" />,
      bg: 'bg-blue-50/50 border-blue-100',
    },
    {
      label: 'Promo Code Savings',
      amount: savings.discountSavings,
      icon: <Tag size={14} className="text-brand-orange" />,
      bg: 'bg-brand-orange/5 border-brand-orange/10',
    },
    {
      label: 'Redeemed Credits',
      amount: savings.cashbackEarned,
      icon: <CreditCard size={14} className="text-emerald-500" />,
      bg: 'bg-emerald-50/50 border-emerald-100',
    },
  ];

  return (
    <div className="p-6 bg-white border border-border-main rounded-3xl shadow-xs text-left w-full">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank size={18} className="text-emerald-600" />
        <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">Your Total Savings</h3>
      </div>

      <div className="mb-6">
        <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest block">Accumulated savings</span>
        <span className="text-3xl font-black text-emerald-600">₹{totalSaved}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className={`p-4 border rounded-2xl ${m.bg}`}>
            <div className="flex items-center gap-1.5 mb-2">
              {m.icon}
              <span className="text-[9px] font-extrabold text-text-secondary uppercase tracking-wider truncate">{m.label}</span>
            </div>
            <span className="text-lg font-black text-text-primary">₹{m.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
