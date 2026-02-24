import React from "react";
import RiderMapComponent from "../components/RiderMap";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../../components/PageLoader";

export default function RiderMap() {
    const { loading } = useAuth();

    if (loading) return <PageLoader />;

    return (
        <div className="bg-[#0B1220] min-h-screen flex flex-col pb-safe relative font-sans">
            <div className="flex-1 relative">
                <RiderMapComponent />
            </div>

            {/* Bottom Sheet overlay is now handled inside the component or we can add specific page-level details here if needed. 
                For now, the component handles the map and navigation button. 
            */}
            <div className="absolute bottom-6 left-0 right-0 z-10 px-4 pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl pointer-events-auto">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Live Tracking Active
                    </h2>
                </div>
            </div>
        </div>
    );
}
