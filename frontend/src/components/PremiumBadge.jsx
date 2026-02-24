import React from "react";
import { Crown } from "lucide-react";

export function PremiumBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-sm">
            <Crown size={10} fill="currentColor" />
            Premium
        </span>
    );
}
