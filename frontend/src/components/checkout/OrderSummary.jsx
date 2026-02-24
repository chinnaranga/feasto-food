import React from "react";
import { Shield, CreditCard } from "lucide-react";
import Button from "../ui/Button";

export default function OrderSummary({ subtotal = 0, deliveryFee = 40, onPlaceOrder, isLoading }) {
    const total = subtotal + deliveryFee;

    return (
        <aside className="sticky top-24 bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl h-fit">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="text-orange-500" size={18} />
                Order Summary
            </h3>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Items Total</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-200">Total to Pay</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        ₹{total.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <Button
                    className="w-full py-4 text-lg shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-500 text-white border-none"
                    onClick={onPlaceOrder}
                    isLoading={isLoading}
                >
                    Place Order
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 bg-white/5 py-2 rounded-lg">
                    <Shield size={10} className="text-green-500" />
                    Secure Payment • SSL Encrypted
                </div>
            </div>
        </aside>
    );
}
