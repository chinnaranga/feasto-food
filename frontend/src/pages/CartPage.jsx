import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag,
  Sparkles, Gift, Zap, Shield, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "../context/CartContext";
import toast from "react-hot-toast";
import FiaMascot from "../components/FiaMascot";

import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";
import LiquidInput from "../components/liquid/LiquidInput";
import { Badge } from "../components/ui";

/* -------------------- CONSTANTS -------------------- */
const FREE_DELIVERY_THRESHOLD = 500;

/* -------------------- AI INSIGHT CARD -------------------- */
const CartInsight = ({ itemCount }) => (
  <LiquidCard className="mb-8 border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
        <Sparkles className="text-orange-500" size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">AeroBite Concierge Analysis</p>
        <p className="text-xs text-gray-400">
          This cart is balanced for value and speed. We've confirmed availability.
        </p>
      </div>
      <Badge variant="warning" className="hidden sm:flex items-center gap-1.5">
        <Zap size={12} /> Highly Recommended
      </Badge>
    </div>
  </LiquidCard>
);

/* -------------------- CART ITEM COMPONENT -------------------- */
const CartItemCard = ({ item, onUpdateQuantity, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -50, height: 0 }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
    className="group"
  >
    <LiquidCard className="p-4 hover:border-orange-500/30 transition-all bg-[#0f0f12]/40 backdrop-blur-sm border-white/5" hoverEffect={true}>
      <div className="flex gap-5">
        {/* Image */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl shadow-lg shadow-black/40"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">₹{item.price} each</p>
            </div>
            <p className="font-bold text-lg text-white">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center bg-black/40 rounded-xl border border-white/5 p-1">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-white/10 hover:text-orange-400 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors rounded-lg"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-bold text-sm tabular-nums text-white">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2 hover:bg-white/10 hover:text-orange-400 transition-colors rounded-lg"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemove(item.id)}
              className="group/trash flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <Trash2 size={16} className="group-hover/trash:scale-110 transition-transform" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </LiquidCard>
  </motion.div>
);

/* -------------------- MAIN PAGE -------------------- */
export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  /* Calculations */
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const promoDiscount = appliedPromo ? subtotal * (appliedPromo.discount / 100) : 0;
    const discounted = subtotal - promoDiscount;
    const tax = discounted * 0.18;
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (subtotal > 0 ? 40 : 0);
    const total = discounted + tax + delivery;

    return { subtotal, promoDiscount, tax, delivery, total };
  }, [cartItems, appliedPromo]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /* Actions */
  const handleApplyPromo = () => {
    // Mock promo logic
    if (promoCode.toUpperCase() === "TASTY20") {
      setAppliedPromo({ name: "TASTY20", discount: 20 });
      setPromoCode("");
      toast.success("Promo code applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/checkout", { state: { appliedPromo } });
      setIsLoading(false);
    }, 1000);
  };

  /* Empty State */
  if (cartItems.length === 0) {
    return (
      <LiquidBackground className="pt-24 pb-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <LiquidCard className="p-10 text-center">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added anything yet. Explore our restaurants to find something delicious!</p>
            <LiquidButton onClick={() => navigate("/restaurants")}>
              Explore Restaurants
            </LiquidButton>
          </LiquidCard>
        </motion.div>
        <FiaMascot state="cart" />
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground className="text-white pt-24 pb-20 px-6">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <LiquidButton
            variant="ghost"
            onClick={() => navigate("/restaurants")}
            className="rounded-full w-12 h-12 flex items-center justify-center p-0"
          >
            <ArrowLeft size={20} />
          </LiquidButton>
          <div>
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <p className="text-gray-400 text-sm">{itemCount} items ready</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-6">
            <CartInsight itemCount={itemCount} />

            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <LiquidCard className="sticky top-28 p-6 border-white/10 bg-[#18181b]/80 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Sparkles className="text-orange-500" size={20} />
                Order Summary
              </h2>

              {/* Promo Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <LiquidInput
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code"
                    className="pl-10"
                  />
                </div>
                <LiquidButton
                  onClick={handleApplyPromo}
                  disabled={!promoCode}
                  className="rounded-xl px-4"
                >
                  Apply
                </LiquidButton>
              </div>

              {appliedPromo && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex justify-between items-center text-sm">
                  <span className="text-green-400 font-medium flex items-center gap-2">
                    <Check size={14} /> {appliedPromo.name} applied
                  </span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm text-gray-300 pb-6 border-b border-white/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculations.subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{calculations.promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{calculations.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={calculations.delivery === 0 ? "text-green-400 font-bold" : ""}>
                    {calculations.delivery === 0 ? "FREE" : `₹${calculations.delivery}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 mb-8">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  ₹{calculations.total.toFixed(2)}
                </span>
              </div>

              <LiquidButton
                onClick={handleCheckout}
                className="w-full py-6 text-lg rounded-xl shadow-lg shadow-orange-500/20"
                isLoading={isLoading}
              >
                Proceed to Checkout
              </LiquidButton>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={12} />
                Secure & Encrypted Checkout
              </div>

            </LiquidCard>
          </div>
        </div>
      </div>

      <FiaMascot state="cart" />
    </LiquidBackground>
  );
}