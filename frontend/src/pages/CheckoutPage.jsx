import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../context/CartContext";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import FiaMascot from "../components/FiaMascot";
import SEO from "../components/SEO";
import toast from "react-hot-toast";

import LiquidBackground from "../components/liquid/LiquidBackground";
// New Components
import AddressStep from "../components/checkout/AddressStep";
import DeliveryStep from "../components/checkout/DeliveryStep";
import OrderSummary from "../components/checkout/OrderSummary";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [address, setAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Cart Logic
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40; // Fixed for now, can be dynamic from DeliveryStep later
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) navigate("/cart");
  }, [cartItems, navigate]);

  const handlePlaceOrder = () => {
    if (!address) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsPlacingOrder(true);
    setTimeout(() => {
      setIsPlacingOrder(false);
      navigate("/payments", {
        state: {
          total: total,
          items: cartItems,
          deliveryMode: "standard", // default
          deliveryAddress: address.text,
          location: { lat: address.lat, lng: address.lng }
        }
      });
    }, 1000);
  };

  return (
    <LiquidBackground>
      <SEO title="Checkout" description="Complete your order" />

      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-20 px-4 md:px-8">

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="rounded-full hover:bg-white/10">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* LEFT COLUMN: Map & Details */}
            <div className="lg:col-span-2 space-y-6">
              <AddressStep onValidAddress={setAddress} />
              <DeliveryStep />
            </div>

            {/* RIGHT COLUMN: Sticky Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                onPlaceOrder={handlePlaceOrder}
                isLoading={isPlacingOrder}
              />
            </div>

          </div>
        </div>

        <FiaMascot state="checkout" />
      </div>
    </LiquidBackground>
  );
}