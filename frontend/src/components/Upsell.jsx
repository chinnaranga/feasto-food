import React from "react";

export function Upsell({ item }) {
    return (
        <div className="text-sm text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span className="text-xs">💡</span> People often add {item} with this 🍟
        </div>
    );
}
