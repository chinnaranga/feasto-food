import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { AICartAssistantBar } from '@/components/cart/AICartAssistantBar';

export const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTaxes,
    getDiscount,
    getTotal,
    getItemCount,
    promoCode,
    promoDiscount,
    applyPromo,
    clearPromo,
  } = useCartStore();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = React.useState('');
  const [promoMessage, setPromoMessage] = React.useState<{ text: string; success: boolean } | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const taxes = getTaxes();
  const discount = getDiscount();
  const total = getTotal();
  const count = getItemCount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, success: res.success });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#F3F0E8] flex flex-col items-center justify-center gap-6 text-center px-6 pt-24 pb-20 select-none">
        <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
          Empty Order Ticket
        </span>
        <h2 className="editorial-display-giant text-[#141518]">
          NOTHING<br />IN BAG.
        </h2>
        <p className="font-sans text-sm text-[#52555F] max-w-sm">
          Select dishes from real kitchens to build your order ticket.
        </p>
        <Link to="/restaurants" className="btn-graphic-primary mt-2">
          Explore Kitchens →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-28 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#141518]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#52555F] block mb-1">
              Order Review · {items[0]?.restaurantName || 'Feasto Kitchen'}
            </span>
            <h1 className="editorial-display-sub text-[#141518]">
              YOUR ORDER BAG.
            </h1>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-[#52555F]">{count} {count === 1 ? 'ITEM' : 'ITEMS'}</span>
            <button
              onClick={() => clearCart()}
              className="text-[#991B1B] hover:underline"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
          
          {/* Items List (Left Column) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col divide-y divide-[#E2DED4] border-t border-b border-[#E2DED4]">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold text-base text-[#141518]">
                        {item.item.name}
                      </h3>
                      {item.spiceLevel && (
                        <span className="font-mono text-[10px] uppercase text-[#8A8D98]">
                          [{item.spiceLevel}]
                        </span>
                      )}
                    </div>
                    {item.specialInstructions && (
                      <p className="font-sans text-xs text-[#52555F] italic mb-1">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}
                    <span className="font-mono text-xs text-[#8A8D98]">
                      ₹{item.unitPrice} each
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#141518] font-mono text-xs">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeItem(item.cartItemId);
                          } else {
                            updateQuantity(item.cartItemId, item.quantity - 1);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/10 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total for item */}
                    <span className="font-mono text-base font-bold text-[#141518] min-w-[70px] text-right">
                      ₹{item.totalPrice}
                    </span>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-[#8A8D98] hover:text-[#991B1B] font-mono text-xs"
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Cart Copilot */}
            <AICartAssistantBar restaurantId={items[0]?.restaurantId || 'feasto-kitchen'} />

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D98] block mb-2">
                Promotional Code (e.g. FEASTO20)
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter code"
                  className="px-4 py-2.5 bg-white border border-[#E2DED4] text-xs font-mono uppercase focus:outline-none focus:border-[#141518]"
                />
                <button type="submit" className="btn-graphic-primary text-xs py-2 px-4">
                  Apply
                </button>
              </div>
              {promoMessage && (
                <span
                  className={`font-mono text-xs mt-2 block ${
                    promoMessage.success ? 'text-[#15803D]' : 'text-[#991B1B]'
                  }`}
                >
                  {promoMessage.text}
                </span>
              )}
            </form>
          </div>

          {/* Ticket Summary (Right Column) */}
          <div className="lg:col-span-5 bg-white border border-[#141518] p-6 sm:p-8 flex flex-col gap-6">
            <div className="pb-3 border-b border-[#E2DED4]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
                Accounting
              </span>
              <h3 className="font-heading font-bold text-lg text-[#141518]">
                Payment Breakdown
              </h3>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#52555F]">Item Subtotal</span>
                <span className="text-[#141518]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#52555F]">Standard Courier Dispatch</span>
                <span className="text-[#141518]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#52555F]">Estimated Taxes (5% GST)</span>
                <span className="text-[#141518]">₹{taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Promo Discount ({promoDiscount}%)</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#141518] flex items-baseline justify-between font-mono">
              <span className="text-sm font-bold uppercase tracking-wider text-[#141518]">
                Total Payable
              </span>
              <span className="text-2xl font-bold text-[#141518]">₹{total}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="btn-graphic-acid w-full justify-center py-3.5 text-xs font-bold"
              >
                Proceed to Checkout →
              </button>
              <Link
                to="/restaurants"
                className="block text-center font-mono text-xs text-[#8A8D98] hover:text-[#141518] mt-3"
              >
                ← Add more dishes from kitchen
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
