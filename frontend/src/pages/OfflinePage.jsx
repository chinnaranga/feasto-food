import FiaMascot from "../components/FiaMascot";
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
    return (
        <LiquidContainer>
            <div className="min-h-screen flex items-center justify-center p-6">
                <LiquidCard className="text-center max-w-md w-full p-8 md:p-10 shadow-2xl">

                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-lg liquid-glass-high border-border-white/10">
                        <WifiOff className="w-10 h-10 text-gray-400" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                        You're Offline
                    </h1>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                        AeroBite can't reach the kitchen right now.
                        Check your internet and we’ll reconnect automatically.
                    </p>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-8 text-left backdrop-blur-md">
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Your cart is safe</li>
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> No orders lost</li>
                            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Payments stay secure</li>
                        </ul>
                    </div>

                    <LiquidButton
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
                    </LiquidButton>
                </LiquidCard>

                <div className="absolute bottom-4 right-4 z-0 pointer-events-none opacity-50">
                    <FiaMascot state="offline" mood="offline" />
                </div>
            </div>
        </LiquidContainer>
    );
}
