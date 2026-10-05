import React, { useState } from 'react';
import { Tag, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

// ─── Price Breakdown ─────────────────────────────────────────────────────────

export const PriceBreakdown: React.FC = () => {
  const { getSubtotal, getDeliveryFee, getTaxes, getDiscount, getTotal, promoCode, promoDiscount, creditApplied } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const taxes = getTaxes();
  const discount = getDiscount();
  const total = getTotal();

  const freeDeliveryAt = 500;
  const remaining = Math.max(0, freeDeliveryAt - subtotal);
  const progress = Math.min(100, (subtotal / freeDeliveryAt) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Free delivery progress */}
      {subtotal > 0 && deliveryFee > 0 && (
        <div className="p-3 bg-brand-orange/5 border border-brand-orange/15 rounded-xl">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-text-secondary">Add ₹{remaining} more for free delivery</span>
          </div>
          <div className="w-full h-1.5 bg-border-main rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {deliveryFee === 0 && subtotal > 0 && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
          <CheckCircle2 size={13} />
          <span>You've unlocked free delivery! 🎉</span>
        </div>
      )}

      {/* Line items */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-bold text-text-primary">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Delivery fee</span>
          <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-text-primary'}`}>
            {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Taxes (5% GST)</span>
          <span className="font-bold text-text-primary">₹{taxes}</span>
        </div>
        {promoCode && discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>{promoCode} ({promoDiscount}% off)</span>
            <span>−₹{discount}</span>
          </div>
        )}
        {creditApplied > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Redeemed Credits</span>
            <span>−₹{creditApplied}</span>
          </div>
        )}
        <div className="flex justify-between pt-3 border-t border-border-main font-black text-base text-text-primary">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Promo Code Input ─────────────────────────────────────────────────────────

export const PromoCodeInput: React.FC = () => {
  const { applyPromo, clearPromo, promoCode } = useCartStore();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleApply = () => {
    if (!code.trim()) return;
    const result = applyPromo(code);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) setCode('');
  };

  const handleClear = () => {
    clearPromo();
    setStatus(null);
    setCode('');
  };

  if (promoCode) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-extrabold text-emerald-700">{promoCode} applied</p>
          <p className="text-[10px] text-emerald-600">{status?.message ?? 'Discount applied'}</p>
        </div>
        <button onClick={handleClear} className="text-emerald-600 hover:text-emerald-800 transition-main cursor-pointer">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-secondary-bg border border-border-main hover:border-[#cbd5e1] focus-within:border-brand-orange/40 focus-within:ring-2 focus-within:ring-brand-orange/10 rounded-xl transition-main">
          <Tag size={13} className="text-text-muted shrink-0" />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Promo code"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none uppercase font-bold"
          />
        </div>
        <Button variant="outline" onClick={handleApply} className="px-4 rounded-xl text-xs font-bold shrink-0">
          Apply
        </Button>
      </div>
      {status && (
        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${status.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
          {status.type === 'success' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
          {status.message}
        </div>
      )}
    </div>
  );
};
