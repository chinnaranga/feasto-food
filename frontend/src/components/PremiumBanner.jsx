import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PremiumBanner() {
    const { isPremium } = useAuth();
    const navigate = useNavigate();

    if (isPremium) return null;

    return (
        <div className="rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 border border-yellow-500/20 flex items-center justify-between">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Crown className="text-yellow-500" size={20} />
                </div>
                <div>
                    <p className="font-semibold text-white">Save more with Premium</p>
                    <p className="text-xs text-gray-400">Free delivery + 5% cashback</p>
                </div>
            </div>
            <button
                onClick={() => navigate("/premium")}
                className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 flex items-center gap-1"
            >
                View Plans <ArrowRight size={14} />
            </button>
        </div>
    );
}
