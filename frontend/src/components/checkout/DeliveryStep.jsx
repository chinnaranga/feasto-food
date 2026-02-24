import React, { useState, useEffect } from "react";
import { Truck, Navigation, Clock } from "lucide-react";

export default function DeliveryStep() {
    const [eta, setEta] = useState(null);
    const [distance, setDistance] = useState(null);

    // Simulate Route Calculation (Phase 2 will replace this with OpenRouteService)
    useEffect(() => {
        const timer = setTimeout(() => {
            setEta(35); // 35 mins
            setDistance(4.2); // 4.2 km
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl mt-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Truck className="text-orange-500" size={20} />
                Delivery Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                        <Clock className="text-blue-400" size={18} />
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Est. Time</p>
                    {eta ? (
                        <p className="text-lg font-bold text-white mt-1">{Math.round(eta)} mins</p>
                    ) : (
                        <div className="h-6 w-16 bg-white/10 animate-pulse rounded mt-1" />
                    )}
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                        <Navigation className="text-green-400" size={18} />
                    </div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Distance</p>
                    {distance ? (
                        <p className="text-lg font-bold text-white mt-1">{distance} km</p>
                    ) : (
                        <div className="h-6 w-16 bg-white/10 animate-pulse rounded mt-1" />
                    )}
                </div>
            </div>

            {/* Route visualization placeholder */}
            <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg text-xs text-orange-400/80 text-center">
                Route optimized for fastest delivery
            </div>
        </section>
    );
}
