import { getAuth } from "firebase/auth";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CreditCard,
  Smartphone,
  Lock,
  WifiOff,
  Wallet,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import useCart from "../context/CartContext";
import toast from "react-hot-toast";
import { getPaymentIntent, clearPaymentIntent } from "../utils/paymentIntent";
import { loadRazorpay, isRazorpayConfigured } from "../utils/loadRazorpay";
import { loadCashfree } from "../utils/loadCashfree";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useWallet } from "../context/WalletContext";
import StripeCheckout from "../components/StripeCheckout";

import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidButton from "../components/liquid/LiquidButton";
import LiquidToggle from "../components/liquid/LiquidToggle";
import PaymentMethodCard from "../components/liquid/PaymentMethodCard";

/* ---------------- HELPERS ---------------- */
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* ---------------- COMPONENT ---------------- */
export default function PaymentsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addOrder } = useOrders();
  const { clearCart } = useCart();
  const isOnline = useNetworkStatus();
  const { balance: walletBalance, debitWallet, getWalletPayment } = useWallet();
  const [searchParams] = useSearchParams();

  /* ---------------- ANALYTICS ---------------- */
  const track = useCallback((event, data = {}) => {
    if (import.meta.env.DEV) {
      console.log("[PAYMENT EVENT]", event, data);
    }
  }, []);

  /* ---------------- PAYMENT DATA ---------------- */
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const data = state || getPaymentIntent();
    // Handle both 'total' and 'amount' keys for compatibility
    const totalAmount = data?.total || data?.amount;

    if (!data || !totalAmount) {
      // Check if this is a Stripe return
      const stored = getPaymentIntent();
      if (searchParams.get("success") === "true" && stored) {
        // Allow ensuring data logic below proceeds
      } else {
        console.error("No payment data found", data);
        toast.error("No payment information found");
        navigate("/cart");
        return;
      }
    }

    const normalized = { ...(data || getPaymentIntent()), total: totalAmount || getPaymentIntent()?.total };
    setPaymentData(normalized);
    sessionStorage.setItem("payment_intent", JSON.stringify(normalized));

    track("checkout_viewed", { amount: normalized.total });
  }, []);

  /* ---------------- STATE ---------------- */
  const total = paymentData?.total || 0;
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | processing | success | failed
  const [retryCount, setRetryCount] = useState(0);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const MAX_RETRIES = 3;

  /* ---------------- MOBILE DEFAULT ---------------- */
  useEffect(() => {
    if (isMobile) setPaymentMethod("upi");
  }, []);

  /* ---------------- WALLET SPLIT ---------------- */
  const walletPayment = useWalletBalance
    ? getWalletPayment(total)
    : { walletUsed: 0, onlineAmount: total };

  const { walletUsed, onlineAmount } = walletPayment;

  /* ---------------- FINALIZE ORDER ---------------- */
  const finalizeOrder = useCallback(
    async ({ paymentId, provider, razorpayData }) => {
      // Razorpay Verify
      if (provider === "razorpay") {
        try {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_URL || "https://feasto-backend-production.up.railway.app"}/api/razorpay/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayData.razorpay_order_id,
                razorpay_payment_id: razorpayData.razorpay_payment_id,
                razorpay_signature: razorpayData.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.verified) {
            throw new Error("Payment verification failed");
          }
        } catch (err) {
          console.error("Verification Error", err);
          toast.error("Verification failed but payment may have succeeded. Contact support.");
          throw err;
        }
      }

      // Wallet Debit
      if (walletUsed > 0) {
        debitWallet(walletUsed, "ORDER_PAYMENT", paymentId, "Food order");
      }

      // Add Order
      addOrder({
        id: paymentId,
        items: paymentData.items,
        total,
        walletUsed,
        onlinePaid: onlineAmount,
        status: "Paid",
        date: new Date().toISOString(),
        paymentMethod: provider === "stripe" ? "card" : paymentMethod,
        provider,
      });

      clearCart();
      clearPaymentIntent();

      track("payment_success", { provider, amount: total });
      toast.success("Payment successful 🎉");
      navigate("/orders");
      return true;
    },
    [walletUsed, onlineAmount, paymentData, total, paymentMethod, debitWallet, addOrder, clearCart, navigate, track]
  );

  /* ---------------- RETRY / SUCCESS FROM URL (Stripe/Generic) ---------------- */
  useEffect(() => {
    // Handle Failure
    if (searchParams.get("status") === "failed" || searchParams.get("canceled") === "true") {
      setPaymentStatus("failed");
      setRetryCount(p => p + 1);
      setShowFailurePopup(true);
      if (searchParams.get("canceled")) toast.error("Payment canceled");
    }

    // Handle Success (Stripe)
    if (searchParams.get("success") === "true") {
      const sessionId = searchParams.get("session_id");
      if (sessionId && paymentData && paymentStatus !== "success") {
        setPaymentStatus("success");
        finalizeOrder({
          paymentId: sessionId,
          provider: "stripe",
          razorpayData: null
        });
      }
    }
  }, [searchParams, paymentData]);

  /* ---------------- RAZORPAY PAYMENT ---------------- */
  const handleRazorpayPayment = async () => {
    if (paymentStatus === "processing") return;
    setPaymentStatus("processing");
    toast.loading("Opening UPI app…", { id: "upi" });

    track("payment_started", { method: paymentMethod, amount: onlineAmount });

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Payment gateway failed", { id: "upi" });
      setPaymentStatus("failed");
      return;
    }

    const auth = getAuth();
    const token = auth.currentUser
      ? await auth.currentUser.getIdToken()
      : null;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://feasto-backend-production.up.railway.app"}/api/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            amount: Math.round(onlineAmount * 100), // Paise
            currency: "INR",
            receipt: `feasto_${Date.now()}`,
          }),
        }
      );

      const orderData = await res.json();
      if (!orderData?.id) throw new Error("Order creation failed");

      track("upi_intent_opened");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Feasto",
        description: "Food Order Payment",
        order_id: orderData.id,
        handler: async (response) => {
          await finalizeOrder({
            paymentId: response.razorpay_payment_id,
            provider: "razorpay",
            razorpayData: response,
          });
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("failed");
            setShowFailurePopup(true);
          },
        },
        prefill: {
          name: auth.currentUser?.displayName || "Feasto Customer",
          email: auth.currentUser?.email || "customer@feasto.food",
          contact: auth.currentUser?.phoneNumber || "9999999999",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        upi: {
          flow: "intent",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (res) => {
        track("payment_failed", res.error);
        toast.error(
          res.error.reason === "upi_intent_failed"
            ? "UPI app not responding. Try QR or another app."
            : res.error.description || "Payment failed",
          { id: "upi" }
        );
        setPaymentStatus("failed");
        setRetryCount(p => p + 1);
        setShowFailurePopup(true);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay Error", err);
      toast.error(err.message || "Payment init failed");
      setPaymentStatus("failed");
      setShowFailurePopup(true);
    }
  };

  /* ---------------- CASHFREE PAYMENT ---------------- */
  const handleCashfreePayment = async () => {
    if (paymentStatus === "processing") return;
    setPaymentStatus("processing");
    toast.loading("Initializing Cashfree...", { id: "cf" });

    try {
      const auth = getAuth();
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://feasto-backend-production.up.railway.app"}/api/cashfree/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ amount: onlineAmount }),
        }
      );

      const orderData = await res.json();
      if (!orderData?.payment_session_id) throw new Error("Cashfree order creation failed");

      const cashfree = await loadCashfree("sandbox"); // Use 'production' in production

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        returnUrl: `${window.location.origin}/payment/success?order_id={order_id}`, // Update logic for your return URL
      }).then(function (result) {
        if (result.error) {
          toast.error(result.error.message, { id: "cf" });
          setPaymentStatus("failed");
          setShowFailurePopup(true);
        }
        if (result.redirect) {
          console.log("Redirection...")
        }
      });
    } catch (err) {
      console.error("Cashfree Error", err);
      toast.error(err.message || "Init failed", { id: "cf" });
      setPaymentStatus("failed");
      setShowFailurePopup(true);
    }
  };

  /* ---------------- QUICK PAY ---------------- */
  const handlePay = async () => {
    if (!isOnline) return;
    if (retryCount >= MAX_RETRIES) {
      toast.error("Too many failed attempts. Try another method.");
      return;
    }

    if (onlineAmount <= 0) {
      // Fully covered by wallet
      finalizeOrder({ paymentId: `WAL-${Date.now()}`, provider: 'wallet', razorpayData: null });
      return;
    }

    if (paymentMethod === 'upi') {
      if (isRazorpayConfigured()) {
        await handleRazorpayPayment();
      }
    } else if (paymentMethod === 'cashfree') {
      await handleCashfreePayment();
    }
    // Stripe is handled by StripeCheckout component button, but if we unify:
    // We might need a unified pay handler if Stripe offers one. 
    // For now, Stripe uses its own button inside StripeCheckout.
    // To enable the "Unified CTA", we must trigger Stripe/Razorpay based on selection.
    // The previous StripeCheckout renders a button.
    // We should probably just use Razorpay for cards too in India context if selected. 
    // Or if Stripe is selected, show Stripe Element.
    // User requested "Single Smart CTA".
  };


  if (!paymentData) return <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center text-white">Loading...</div>;

  return (
    <LiquidBackground className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[420px] relative z-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Secure Checkoout</h1>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl backdrop-blur-xl bg-[#0B0F14]/80 border border-white/10 shadow-2xl p-7 relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 1. Order Summary */}
          <div className="mb-8 space-y-3">
            <div
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="flex justify-between items-center text-gray-400 text-sm cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-display">Order Summary</span>
                <motion.div
                  animate={{ rotate: isSummaryExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft size={12} className="-rotate-90 group-hover:text-orange-400" />
                </motion.div>
              </div>
              <span className="font-mono">₹{total.toFixed(2)}</span>
            </div>

            <AnimatePresence>
              {isSummaryExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-2 space-y-2 border-b border-white/10 mb-2">
                    {paymentData.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-500">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {useWalletBalance && walletUsed > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-orange-400 text-sm"
                >
                  <span className="flex items-center gap-1"><Wallet size={12} /> Wallet Applied</span>
                  <span className="font-mono">-₹{walletUsed.toFixed(2)}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-px bg-white/10 my-2" />

            <div className="flex justify-between items-end">
              <span className="text-gray-300 font-medium font-display">Total Payable</span>
              <motion.span
                key={onlineAmount}
                initial={{ scale: 1.2, color: '#fb923c' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-3xl font-bold tracking-tight"
              >
                ₹{onlineAmount.toFixed(2)}
              </motion.span>
            </div>
          </div>

          {/* 2. Wallet Toggle */}
          {walletBalance > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Wallet size={18} className="text-orange-400" />
                    <span className="font-display">Use Wallet Balance</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Available: ₹{walletBalance.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <LiquidToggle
                    checked={useWalletBalance}
                    onChange={setUseWalletBalance}
                    label=""
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Payment Methods */}
          {onlineAmount > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pl-1 font-display">Payment Method</h3>

              <PaymentMethodCard
                title="UPI / Razorpay"
                subtitle="PhonePe, GPay, Paytm, Netbanking"
                icon={Smartphone}
                selected={paymentMethod === 'upi'}
                onClick={() => setPaymentMethod('upi')}
              />

              <PaymentMethodCard
                title="Card Payment"
                subtitle="Credit & Debit Cards (Stripe)"
                icon={CreditCard}
                selected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              />

              <PaymentMethodCard
                title="Cashfree"
                subtitle="UPI, Wallets, Cards via PG"
                icon={Shield}
                selected={paymentMethod === 'cashfree'}
                onClick={() => setPaymentMethod('cashfree')}
              />
            </div>
          )}

          {/* 4. Smart CTA */}
          <div className="mt-2">
            {paymentMethod === 'card' && onlineAmount > 0 ? (
              <StripeCheckout
                amount={onlineAmount}
                items={paymentData.items}
                customerEmail={getAuth().currentUser?.email}
                orderId={`ORD-${Date.now()}`}
                walletUsed={walletUsed}
                onError={(msg) => toast.error(msg)}
              />
            ) : (
              <LiquidButton
                onClick={handlePay}
                disabled={!isOnline || paymentStatus === 'processing'}
                className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${!isOnline || paymentStatus === 'processing'
                  ? 'bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-500/25'
                  }`}
              >
                {paymentStatus === 'processing' ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${onlineAmount.toFixed(2)} Securely`
                )}
              </LiquidButton>
            )}

            <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5 opacity-60">
              <Shield size={12} />
              Secured by 256-bit SSL Encryption
            </p>
          </div>

        </motion.div>
      </div>

      {/* Failure Checkpoint */}
      {showFailurePopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm">
            <div className="bg-[#18181b] border border-red-500/20 rounded-3xl p-6 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✕</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Payment Failed</h2>
              <p className="text-gray-400 text-sm mb-6">
                Unfortunately your transaction could not be completed. Use another method or try again.
              </p>
              <div className="flex gap-3">
                <LiquidButton
                  className="flex-1 bg-white/5 hover:bg-white/10"
                  onClick={() => setShowFailurePopup(false)}
                >
                  Close
                </LiquidButton>
                <LiquidButton
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                  onClick={() => { setShowFailurePopup(false); handlePay(); }}
                >
                  Retry
                </LiquidButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </LiquidBackground>
  );
}
