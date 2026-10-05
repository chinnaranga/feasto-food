import React from 'react';
import { CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';
import type { PaymentMethod } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';

const METHODS: { id: PaymentMethod; label: string; description: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'razorpay', label: 'Razorpay Checkout', description: 'Cards, UPI, Wallet, Netbanking', icon: <Smartphone size={18} />, badge: 'Popular' },
  { id: 'cashfree', label: 'Cashfree Payments', description: 'Cards, UPI, PayLater, Netbanking', icon: <CreditCard size={18} />, badge: 'New' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: <Banknote size={18} />, badge: 'Available' },
];

export const PaymentMethodSelector: React.FC = () => {
  const { checkoutForm, updateCheckoutForm } = useCartStore();

  return (
    <div className="flex flex-col gap-3">
      {METHODS.map((method) => {
        const isSelected = checkoutForm.paymentMethod === method.id;
        return (
          <button
            key={method.id}
            onClick={() => updateCheckoutForm({ paymentMethod: method.id })}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-main cursor-pointer
              ${isSelected
                ? 'bg-brand-orange/5 border-brand-orange/30 ring-2 ring-brand-orange/10'
                : 'bg-primary-bg border-border-main hover:border-[#cbd5e1]'
              }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${isSelected ? 'bg-brand-orange text-white' : 'bg-secondary-bg text-text-muted border border-border-main'}`}>
              {method.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-text-primary">{method.label}</span>
                {method.badge && (
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-main
              ${isSelected ? 'bg-brand-orange border-brand-orange' : 'border-border-main'}`}>
              {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        );
      })}

      {/* Secure notice */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary-bg border border-border-main rounded-xl">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <p className="text-[11px] text-text-muted font-semibold">
          All transactions are 256-bit SSL encrypted and PCI-DSS compliant.
        </p>
      </div>
    </div>
  );
};
