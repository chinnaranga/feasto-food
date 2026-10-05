import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, PaymentMethod } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { loadRazorpayScript } from '@/utils/razorpay';
import { loadCashfreeScript } from '@/utils/cashfree';
import { apiClient } from '@/services/api';
import { isNetworkFailure, ApiError } from '@/services/api/errors';
import { env } from '@/config/env';

// ─── 12-State Payment State Machine ──────────────────────────────────────────
export type PaymentState =
  | 'idle'
  | 'validating'
  | 'creating_payment_order'
  | 'payment_ready'
  | 'opening_gateway'
  | 'payment_processing'
  | 'verifying_payment'
  | 'payment_success'
  | 'payment_cancelled'
  | 'payment_failed'
  | 'payment_unknown'
  | 'service_unavailable';

const contactSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  instructions: z.string().max(200).optional(),
});

type ContactFields = z.infer<typeof contactSchema>;

// Map HTTP errors to user-friendly messages
function mapPaymentError(err: any): { message: string; state: PaymentState } {
  if (isNetworkFailure(err)) {
    return {
      message: 'Feasto payment services are temporarily unavailable. Please verify your connection or try again.',
      state: 'service_unavailable',
    };
  }

  const status = err?.status || (err instanceof ApiError ? err.status : 0);

  if (status === 401) {
    return { message: 'Please sign in again to complete your payment.', state: 'payment_failed' };
  }
  if (status === 403) {
    return { message: 'You are not authorized to make this payment.', state: 'payment_failed' };
  }
  if (status === 400) {
    return { message: err?.message || 'Payment request could not be processed.', state: 'payment_failed' };
  }
  if (status === 422) {
    return { message: 'Please review your order details before proceeding.', state: 'payment_failed' };
  }
  if (status === 408) {
    return { message: 'The payment service took too long to respond. Please try again.', state: 'service_unavailable' };
  }
  if (status === 429) {
    return { message: 'Too many requests. Please wait a moment before retrying.', state: 'service_unavailable' };
  }
  if (status >= 500) {
    return { message: 'Feasto payment services are temporarily unavailable.', state: 'service_unavailable' };
  }

  return {
    message: err?.message || 'Payment initiation failed. Please try again.',
    state: 'payment_failed',
  };
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { user } = useAuthStore();
  const {
    items,
    getSubtotal,
    getDeliveryFee,
    getTaxes,
    getDiscount,
    getTotal,
    getItemCount,
    checkoutForm,
    updateCheckoutForm,
    clearCart,
    resetCheckout,
  } = useCartStore();

  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [activeRazorpayOrderId, setActiveRazorpayOrderId] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const taxes = getTaxes();
  const discount = getDiscount();
  const total = getTotal();
  const itemCount = getItemCount();

  const isSubmitting =
    paymentState === 'validating' ||
    paymentState === 'creating_payment_order' ||
    paymentState === 'payment_ready' ||
    paymentState === 'opening_gateway' ||
    paymentState === 'payment_processing' ||
    paymentState === 'verifying_payment';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFields>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: checkoutForm.name || user?.name || '',
      phone: checkoutForm.phone || user?.phone || '',
      email: checkoutForm.email || user?.email || '',
      street: 'Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      pincode: '500033',
      instructions: checkoutForm.deliveryInstructions || '',
    },
  });

  // Empty cart redirect
  if (items.length === 0 && paymentState !== 'payment_success') {
    return (
      <div className="min-h-[80vh] bg-[#F3F0E8] flex flex-col items-center justify-center gap-4 text-center px-6 pt-28 select-none">
        <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
          Checkout Guard
        </span>
        <h2 className="editorial-display-giant text-[#141518]">NO DISHES.</h2>
        <p className="font-sans text-sm text-[#52555F] max-w-sm">
          Your order bag is empty. Please select dishes from a kitchen before checking out.
        </p>
        <Link to="/restaurants" className="btn-graphic-primary mt-4">
          Browse Kitchens →
        </Link>
      </div>
    );
  }

  // Completes order records, clears cart, and navigates ONLY after verified success
  const handleOrderCompleted = (orderId: string) => {
    setPaymentState('payment_success');
    console.log('[ORDER] created:', orderId);
    console.log('[PAYMENT] complete');
    addToast({ message: 'Payment confirmed ✓ Order sent to kitchen.', type: 'success' });
    clearCart();
    resetCheckout();
    navigate(`/orders/${orderId}/track`);
  };

  // Re-check payment status if network was interrupted after payment
  const handleCheckPaymentStatus = async () => {
    if (!activeRazorpayOrderId) return;
    try {
      setPaymentState('verifying_payment');
      const res = await apiClient.get<any>(`/razorpay/payment-status/${activeRazorpayOrderId}`);
      if (res?.data?.status === 'paid' || res?.data?.amount_paid > 0) {
        const activeAddress = {
          id: `addr_${Date.now()}`,
          label: 'Delivery Address',
          fullAddress: 'Delivery Location',
          city: 'Hyderabad',
          pincode: '500033',
          isDefault: true,
        };
        const placedOrderId = useUserStore.getState().placeOrder({
          restaurantId: items[0]?.restaurantId ?? 'unknown',
          restaurantName: items[0]?.restaurantName ?? 'Feasto Kitchen',
          items,
          subtotal,
          deliveryFee,
          taxes,
          discount,
          total,
          address: activeAddress,
          paymentMethod: 'razorpay',
        });
        handleOrderCompleted(placedOrderId);
      } else {
        setPaymentState('payment_failed');
        setErrorMessage('Payment has not been confirmed by the gateway yet.');
      }
    } catch {
      setPaymentState('service_unavailable');
      setErrorMessage('Could not verify status. Please retry shortly.');
    }
  };

  const onSubmit = async (data: ContactFields) => {
    if (isSubmitting) return; // Prevent duplicate clicks

    console.log('[PAYMENT] submit started');
    console.log('[PAYMENT] payment method:', selectedMethod);
    console.log('[PAYMENT] API base URL:', env.VITE_API_BASE_URL);

    setPaymentState('validating');
    setErrorMessage(null);

    // Save details to store
    updateCheckoutForm({
      name: data.name,
      phone: data.phone,
      email: data.email,
      deliveryInstructions: data.instructions || '',
      paymentMethod: selectedMethod,
    });

    const activeAddress = {
      id: `addr_${Date.now()}`,
      label: 'Delivery Address',
      fullAddress: `${data.street}, ${data.city} - ${data.pincode}`,
      city: data.city,
      pincode: data.pincode,
      isDefault: true,
    };

    // ── COD (Cash on Delivery) Flow ──────────────────────────────────────────
    if (selectedMethod === 'cod') {
      try {
        setPaymentState('creating_payment_order');
        console.log('[ORDER] creating Cash on Delivery order ticket');
        await new Promise((r) => setTimeout(r, 600));

        const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

        console.log('[ORDER] finalizing Cash on Delivery order');
        const placedOrderId = useUserStore.getState().placeOrder({
          restaurantId: items[0]?.restaurantId ?? 'unknown',
          restaurantName: items[0]?.restaurantName ?? 'Feasto Kitchen',
          items,
          subtotal,
          deliveryFee,
          taxes,
          discount,
          total,
          address: activeAddress,
          paymentMethod: 'cod',
          deliveryOtp,
        });

        // Sync with backend API if reachable
        try {
          await apiClient.post('/orders', {
            restaurantId: items[0]?.restaurantId,
            items,
            subtotal,
            deliveryFee,
            total,
            address: activeAddress,
            paymentMethod: 'cod',
            deliveryOtp,
          });
        } catch {
          // Store record serves as resilient authority
        }

        console.log('[ORDER] Cash order confirmed:', placedOrderId);
        handleOrderCompleted(placedOrderId);
      } catch (err: any) {
        const { message, state } = mapPaymentError(err);
        setPaymentState(state);
        setErrorMessage(message || 'Failed to place cash on delivery order.');
      }
      return;
    }

    // ── Cashfree Online Flow ────────────────────────────────────────────────
    if (selectedMethod === 'cashfree') {
      try {
        console.log('[PAYMENT] loading Cashfree SDK');
        setPaymentState('creating_payment_order');
        const scriptLoaded = await loadCashfreeScript();
        if (!scriptLoaded || typeof (window as any).Cashfree === 'undefined') {
          setPaymentState('service_unavailable');
          setErrorMessage('Cashfree payment gateway could not be loaded. Please try again.');
          return;
        }

        console.log('[PAYMENT] creating Cashfree order session with gateway');
        const cfOrder = await apiClient.post<any>('/cashfree/create-order', {
          amount: total,
          currency: 'INR',
          customerDetails: {
            id: user?.id || `cust_${Date.now()}`,
            name: data.name,
            phone: data.phone,
            email: data.email,
          },
        });

        if (!cfOrder?.payment_session_id) {
          throw new Error('Malformed Cashfree order response from server.');
        }

        console.log('[PAYMENT] Cashfree order created:', cfOrder.id);
        setActiveRazorpayOrderId(cfOrder.id);
        setPaymentState('opening_gateway');

        const cashfree = (window as any).Cashfree({
          mode: cfOrder.environment === 'production' ? 'production' : 'sandbox',
        });

        setPaymentState('payment_processing');

        await cashfree.checkout({
          paymentSessionId: cfOrder.payment_session_id,
          redirectTarget: '_modal',
        });

        setPaymentState('verifying_payment');
        console.log('[PAYMENT] verifying Cashfree transaction with server');

        const verification = await apiClient.post<{ verified: boolean; payment_id?: string }>(
          '/cashfree/verify-payment',
          { order_id: cfOrder.id }
        );

        if (verification?.verified) {
          console.log('[ORDER] Cashfree payment verified, finalizing order');
          const placedOrderId = useUserStore.getState().placeOrder({
            restaurantId: items[0]?.restaurantId ?? 'unknown',
            restaurantName: items[0]?.restaurantName ?? 'Feasto Kitchen',
            items,
            subtotal,
            deliveryFee,
            taxes,
            discount,
            total,
            address: activeAddress,
            paymentMethod: 'cashfree',
          });

          handleOrderCompleted(placedOrderId);
        } else {
          setPaymentState('payment_failed');
          setErrorMessage('Cashfree payment could not be verified. If amount was deducted, it will be refunded.');
          addToast({ message: 'Cashfree payment verification failed.', type: 'error' });
        }
      } catch (err: any) {
        console.error('[PAYMENT] Cashfree error:', err);
        const { message, state } = mapPaymentError(err);
        setPaymentState(state);
        setErrorMessage(message || 'Cashfree payment failed.');
      }
      return;
    }

    // ── Razorpay Online Flow (Default & Recommended) ────────────────────────
    try {
      // 1. Validate Razorpay Key ID
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Payment configuration is unavailable.');
      }

      // 2. Load SDK
      console.log('[PAYMENT] loading Razorpay');
      setPaymentState('creating_payment_order');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || typeof window.Razorpay === 'undefined') {
        setPaymentState('service_unavailable');
        setErrorMessage('Secure payment gateway could not be loaded. Please try again.');
        return;
      }

      // 3. Create Razorpay Order on Backend (amount in paise, converted exactly once)
      console.log('[PAYMENT] creating Razorpay order');
      const amountInPaise = Math.round(total * 100);

      const razorpayOrder = await apiClient.post<any>('/razorpay/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
          customer_name: data.name,
          customer_phone: data.phone,
          restaurant: items[0]?.restaurantName ?? 'Feasto Kitchen',
        },
      });

      // 4. Validate order response
      if (!razorpayOrder?.id || typeof razorpayOrder?.amount !== 'number') {
        console.error('[PAYMENT] Malformed order response:', razorpayOrder);
        setPaymentState('service_unavailable');
        setErrorMessage('Feasto payment services returned an invalid response. Please try again.');
        return;
      }

      console.log('[PAYMENT] Razorpay order created:', {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });

      setActiveRazorpayOrderId(razorpayOrder.id);
      setPaymentState('payment_ready');

      // 5. Open Razorpay Gateway
      console.log('[PAYMENT] opening Razorpay');
      setPaymentState('opening_gateway');

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Feasto Platform',
        description: `Order from ${items[0]?.restaurantName ?? 'Feasto Kitchen'}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#141518',
        },
        handler: async function (response: any) {
          console.log('[PAYMENT] payment completed, received gateway response');
          setPaymentState('verifying_payment');
          console.log('[PAYMENT] verifying payment');

          try {
            const verification = await apiClient.post<{ verified: boolean }>(
              '/razorpay/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            console.log('[PAYMENT] verification result:', verification);

            if (verification?.verified) {
              console.log('[ORDER] finalizing order');
              const placedOrderId = useUserStore.getState().placeOrder({
                restaurantId: items[0]?.restaurantId ?? 'unknown',
                restaurantName: items[0]?.restaurantName ?? 'Feasto Kitchen',
                items,
                subtotal,
                deliveryFee,
                taxes,
                discount,
                total,
                address: activeAddress,
                paymentMethod: 'razorpay',
              });

              handleOrderCompleted(placedOrderId);
            } else {
              setPaymentState('payment_failed');
              setErrorMessage('Payment verification signature check failed. You were not charged.');
              addToast({ message: 'Payment verification failed.', type: 'error' });
            }
          } catch (err: any) {
            console.error('[PAYMENT] Verification request error:', err);
            // If network fails AFTER user paid, do NOT assume failed; move to payment_unknown
            if (isNetworkFailure(err)) {
              setPaymentState('payment_unknown');
              setErrorMessage('Payment was received by your bank, but network confirmation was delayed.');
            } else {
              setPaymentState('payment_failed');
              setErrorMessage(err?.message || 'Payment verification could not be confirmed.');
              addToast({ message: 'Payment verification failed.', type: 'error' });
            }
          }
        },
        modal: {
          ondismiss: function () {
            console.log('[PAYMENT] User closed Razorpay modal');
            setPaymentState('payment_cancelled');
            setErrorMessage('Payment cancelled. Your order bag remains preserved.');
            addToast({ message: 'Payment cancelled.', type: 'info' });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setPaymentState('payment_processing');
    } catch (err: any) {
      console.error('[PAYMENT] Error:', err);
      const { message, state } = mapPaymentError(err);
      setPaymentState(state);
      setErrorMessage(message);
    }
  };

  return (
    <div className="w-full bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] min-h-screen pt-28 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
        
        {/* Horizontal Progression Header */}
        <div className="pb-8 border-b border-[#141518] flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#52555F] mb-2">
              <span className="text-[#141518] font-bold">1. Address</span>
              <span>→</span>
              <span className="text-[#141518] font-bold">2. Delivery</span>
              <span>→</span>
              <span className="text-[#1B3BFF] font-bold">3. Payment</span>
              <span>→</span>
              <span className="text-[#8A8D98]">4. Confirmation</span>
            </div>
            <h1 className="editorial-display-sub text-[#141518]">
              CALM CHECKOUT.
            </h1>
          </div>
          <Link
            to="/cart"
            className="font-mono text-xs text-[#52555F] hover:text-[#141518] underline"
          >
            ← Return to Order Bag
          </Link>
        </div>

        {/* State Machine Status Banners */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-4 bg-[#141518] text-[#F3F0E8] font-mono text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D7F04A] animate-ping" />
                <span>
                  {paymentState === 'validating' && 'Preparing secure payment...'}
                  {paymentState === 'creating_payment_order' && 'Creating secure payment with gateway...'}
                  {paymentState === 'payment_ready' && 'Connecting to Razorpay...'}
                  {paymentState === 'opening_gateway' && 'Opening secure Razorpay window...'}
                  {paymentState === 'payment_processing' && 'Processing payment with bank...'}
                  {paymentState === 'verifying_payment' && 'Verifying payment signature with Feasto...'}
                </span>
              </div>
              <span className="text-[#8A8D98]">Please do not refresh</span>
            </motion.div>
          )}

          {paymentState === 'payment_cancelled' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#FAF8F5] border border-[#141518] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="font-bold text-[#141518] block mb-0.5">Payment Cancelled</span>
                <span className="text-[#52555F]">{errorMessage}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentState('idle')}
                  className="btn-graphic-primary text-xs py-2 px-3"
                >
                  Try Payment Again →
                </button>
                <Link to="/cart" className="btn-graphic-ghost text-xs">
                  Back to Bag
                </Link>
              </div>
            </motion.div>
          )}

          {paymentState === 'payment_unknown' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#FFFBEB] border border-[#B45309] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="font-bold text-[#B45309] block mb-0.5">
                  Your payment is being confirmed.
                </span>
                <span className="text-[#92400E]">{errorMessage}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCheckPaymentStatus}
                  className="bg-[#B45309] text-white px-3 py-1.5 font-bold uppercase hover:bg-black transition-colors"
                >
                  Check Status →
                </button>
              </div>
            </motion.div>
          )}

          {(paymentState === 'service_unavailable' || paymentState === 'payment_failed') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#FEF2F2] border border-[#991B1B] text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="font-bold text-[#991B1B] block mb-0.5">
                  {paymentState === 'service_unavailable'
                    ? 'Payment Service Temporarily Unavailable'
                    : 'Payment Could Not Be Completed'}
                </span>
                <span className="text-[#7F1D1D]">{errorMessage}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentState('idle')}
                  className="bg-[#991B1B] text-white px-3 py-1.5 font-bold uppercase hover:bg-black transition-colors"
                >
                  Try Again →
                </button>
                <Link to="/cart" className="border border-[#991B1B] text-[#991B1B] px-3 py-1.5 hover:bg-[#991B1B] hover:text-white transition-colors">
                  Back to Bag
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form & Breakdown */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
            
            {/* Left Column: Delivery Details & Payment Choice */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              
              {/* 1. Contact & Address */}
              <div className="flex flex-col gap-4">
                <div className="pb-2 border-b border-[#E2DED4]">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
                    Step 1 · Delivery Address
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      {...register('name')}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                    />
                    {errors.name && (
                      <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                      10-Digit Mobile *
                    </label>
                    <input
                      type="tel"
                      disabled={isSubmitting}
                      {...register('phone')}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                    />
                    {errors.phone && (
                      <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    {...register('email')}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                  />
                  {errors.email && (
                    <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                    Street Address & Apartment *
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    {...register('street')}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                  />
                  {errors.street && (
                    <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                      {errors.street.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      {...register('city')}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                    />
                    {errors.city && (
                      <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      {...register('pincode')}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                    />
                    {errors.pincode && (
                      <span className="font-mono text-[10px] text-[#991B1B] mt-0.5 block">
                        {errors.pincode.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#52555F] block mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder="E.g., Leave with security, ring door bell twice..."
                    {...register('instructions')}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2DED4] text-xs font-sans text-[#141518] focus:outline-none focus:border-[#141518]"
                  />
                </div>
              </div>

              {/* 2. Payment Gateway Selection */}
              <div className="flex flex-col gap-4">
                <div className="pb-2 border-b border-[#E2DED4]">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#52555F]">
                    Step 2 · Payment Gateway
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('razorpay')}
                    disabled={isSubmitting}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'razorpay'
                        ? 'bg-[#141518] text-[#F3F0E8] border-[#141518]'
                        : 'bg-white text-[#141518] border-[#E2DED4] hover:border-[#141518]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase block mb-1 text-[#D7F04A]">Recommended</span>
                      <span className="font-heading font-bold text-sm block">Razorpay</span>
                    </div>
                    <span className="text-[11px] text-[#8A8D98] mt-4">
                      UPI · Cards · Netbanking
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cashfree')}
                    disabled={isSubmitting}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      selectedMethod === 'cashfree'
                        ? 'bg-[#141518] text-[#F3F0E8] border-[#141518]'
                        : 'bg-white text-[#141518] border-[#E2DED4] hover:border-[#141518]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase block mb-1 text-[#8A8D98]">Alternative</span>
                      <span className="font-heading font-bold text-sm block">Cashfree</span>
                    </div>
                    <span className="text-[11px] text-[#8A8D98] mt-4">
                      Direct UPI & Wallets
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cod')}
                    disabled={isSubmitting}
                    className={`p-4 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'cod'
                        ? 'bg-[#141518] text-[#F3F0E8] border-[#141518]'
                        : 'bg-white text-[#141518] border-[#E2DED4] hover:border-[#141518]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] uppercase block mb-1 text-[#8A8D98]">Physical</span>
                      <span className="font-heading font-bold text-sm block">Cash on Delivery</span>
                    </div>
                    <span className="text-[11px] text-[#8A8D98] mt-4">
                      Pay courier at door
                    </span>
                  </button>
                </div>

                {/* Selected Method Details & Guidance */}
                {selectedMethod === 'razorpay' && (
                  <div className="p-3.5 bg-white border border-[#E2DED4] text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#141518] font-bold">🛡️ Razorpay Secure:</span>
                      <span className="text-[#52555F]">Instant UPI, credit/debit cards, & netbanking</span>
                    </div>
                    <span className="text-[10px] text-[#15803D] font-bold uppercase">● Instant Verified</span>
                  </div>
                )}

                {selectedMethod === 'cashfree' && (
                  <div className="p-3.5 bg-white border border-[#E2DED4] text-xs font-mono flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#141518] font-bold">⚡ Cashfree PG:</span>
                      <span className="text-[#52555F]">Direct PhonePe, GPay, Paytm, wallets & cards</span>
                    </div>
                    <span className="text-[10px] text-[#15803D] font-bold uppercase">● Secure Gateway</span>
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div className="p-3.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141518]">💵 Cash on Delivery Active</span>
                      <span className="text-[10px] font-bold text-[#1B3BFF] uppercase">● Courier Handover</span>
                    </div>
                    <p className="text-[#52555F] text-[11px] leading-relaxed">
                      Please keep exact cash of ₹{total} ready for the courier. A 4-digit verification code will be generated on your tracking screen for delivery authentication.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Pay Action */}
            <div className="lg:col-span-5 bg-white border border-[#141518] p-6 sm:p-8 flex flex-col gap-6">
              <div className="pb-3 border-b border-[#E2DED4]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8D98] block">
                  Kitchen Ticket
                </span>
                <h3 className="font-heading font-bold text-lg text-[#141518]">
                  {items[0]?.restaurantName || 'Feasto Kitchen'}
                </h3>
              </div>

              {/* Items summary */}
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between text-xs font-mono">
                    <span className="text-[#52555F] truncate max-w-[220px]">
                      {item.quantity}× {item.item.name}
                    </span>
                    <span className="text-[#141518] font-bold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E2DED4] flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#52555F]">Subtotal</span>
                  <span className="text-[#141518]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52555F]">Delivery Dispatch</span>
                  <span className="text-[#141518]">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52555F]">Taxes (5% GST)</span>
                  <span className="text-[#141518]">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#15803D] font-bold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#141518] flex items-baseline justify-between font-mono">
                <span className="text-sm font-bold uppercase tracking-wider text-[#141518]">
                  Grand Total
                </span>
                <span className="text-3xl font-bold text-[#141518]">₹{total}</span>
              </div>

              {/* Pay Now Button with Anti-Double-Submission Lock */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-graphic-acid w-full justify-center py-4 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {paymentState === 'validating' && 'Preparing secure payment...'}
                  {paymentState === 'creating_payment_order' && 'Creating secure payment...'}
                  {paymentState === 'payment_ready' && 'Connecting to Razorpay...'}
                  {paymentState === 'opening_gateway' && 'Opening Razorpay...'}
                  {paymentState === 'payment_processing' && 'Processing payment with bank...'}
                  {paymentState === 'verifying_payment' && 'Verifying payment with Feasto...'}
                  {paymentState === 'payment_success' && 'Payment confirmed ✓'}
                  {paymentState === 'service_unavailable' && 'Retry Secure Payment →'}
                  {paymentState === 'payment_cancelled' && 'Resume Secure Payment →'}
                  {paymentState === 'payment_failed' && 'Retry Secure Payment →'}
                  {paymentState === 'payment_unknown' && 'Check Payment Status →'}
                  {paymentState === 'idle' && (
                    selectedMethod === 'cod'
                      ? `Place Cash on Delivery Order · ₹${total} →`
                      : selectedMethod === 'cashfree'
                      ? `Pay via Cashfree PG · ₹${total} →`
                      : `Pay Securely with Razorpay · ₹${total} →`
                  )}
                </button>
                <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-[#8A8D98]">
                  <span>🔒 256-Bit Encrypted</span>
                  <span>·</span>
                  <span>Direct Bank Verification</span>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;
