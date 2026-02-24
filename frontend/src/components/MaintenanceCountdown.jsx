import { useEffect, useState } from "react";
import { useMaintenance } from "../hooks/useMaintenance";
import { getCountdown } from "../utils/countdown";
import { Shield } from "lucide-react";

export default function MaintenanceCountdown() {
    const { active, end, message } = useMaintenance();
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!active || !end) return;

        // Initial check
        setTimeLeft(getCountdown(end.toDate()));

        const interval = setInterval(() => {
            setTimeLeft(getCountdown(end.toDate()));
        }, 1000);

        return () => clearInterval(interval);
    }, [active, end]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 bg-[#0f0f12] flex items-center justify-center text-white z-40 p-6">
            <div className="text-center space-y-4 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <Shield className="text-orange-400" size={40} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    🚧 Maintenance Mode
                </h1>

                <p className="text-gray-400 text-lg">
                    {message}
                </p>

                {timeLeft && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 inline-block">
                        <p className="text-orange-400 font-bold text-2xl tracking-wide">
                            Back in {timeLeft}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Estimated Time</p>
                    </div>
                )}
            </div>
        </div>
    );
}
