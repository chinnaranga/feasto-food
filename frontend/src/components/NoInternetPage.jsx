import { WifiOff } from "lucide-react";
import AeroBiteMascot from "./AeroBiteMascot";

export default function NoInternetPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-primary)] fixed inset-0 z-[99999]">
            <div className="text-center max-w-md px-6">
                {/* Mascot */}
                <div className="mb-6 flex justify-center">
                    <AeroBiteMascot size={80} />
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    No internet connection
                </h1>

                <p className="text-sm text-gray-400 mb-4">
                    Try:
                </p>

                <ul className="text-sm text-gray-400 space-y-1 mb-4">
                    <li>• Checking your network connection</li>
                    <li>• Reconnecting to Wi-Fi or mobile data</li>
                </ul>

                <p className="text-xs text-gray-500">
                    ERR_INTERNET_DISCONNECTED
                </p>

                <div className="mt-6 flex justify-center text-gray-500">
                    <WifiOff size={18} />
                </div>
            </div>
        </div>
    );
}
