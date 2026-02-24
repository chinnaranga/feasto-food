import React, { useState } from "react";
import CheckoutAddressMap from "./CheckoutAddressMap";
import { MapPin, Home, Briefcase, User } from "lucide-react";

export default function AddressStep({ onValidAddress }) {
    const [addressData, setAddressData] = useState(null);
    const [label, setLabel] = useState("Home");

    // Handler when map returns data
    const handleAddressSelect = (data) => {
        setAddressData(data);
        // Propagate up to parent if needed (e.g. for final order submission)
        if (onValidAddress) {
            onValidAddress({
                text: data.display_name,
                lat: data.lat,
                lng: data.lon,
                label
            });
        }
    };

    // Handler when label changes
    const handleLabelChange = (newLabel) => {
        setLabel(newLabel);
        if (addressData && onValidAddress) {
            onValidAddress({
                text: addressData.display_name,
                lat: addressData.lat,
                lng: addressData.lon,
                label: newLabel
            });
        }
    };

    return (
        <section className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="text-orange-500" size={20} />
                    Delivery Address
                </h2>
                {/* Optional: "Use My Location" button if moved out of map */}
            </div>

            <CheckoutAddressMap onAddressSelect={handleAddressSelect} />

            {addressData ? (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-orange-400 font-bold uppercase mb-1">Selected Location</p>
                        <p className="text-sm text-gray-200 leading-relaxed font-medium">
                            {addressData.display_name}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Save address as</label>
                        <div className="flex gap-2">
                            {[
                                { id: "Home", icon: Home },
                                { id: "Work", icon: Briefcase },
                                { id: "Other", icon: User }
                            ].map((opt) => {
                                const Icon = opt.icon;
                                const isActive = label === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleLabelChange(opt.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                                                ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                                                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                                            }`}
                                    >
                                        <Icon size={14} />
                                        {opt.id}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-4 text-center">
                    <div className="h-20 bg-white/5 animate-pulse rounded-xl" />
                    <p className="text-xs text-gray-500 mt-2">Locating you...</p>
                </div>
            )}
        </section>
    );
}
