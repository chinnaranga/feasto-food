import React from "react";

export function FreeDeliveryNudge({ total, threshold = 499 }) {
    if (total >= threshold) return null;
    return (
        <div className="text-sm text-orange-400 font-medium animate-pulse mt-2">
            Add ₹{(threshold - total).toFixed(0)} more for free delivery 🚀
        </div>
    );
}
