export default function MaintenanceScreen({ message, countdown }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f12] text-white text-center px-6">
            <div className="bg-[#18181b] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    🚧 AeroBite is temporarily offline
                </h1>

                <p className="text-gray-400 mb-6 text-lg">
                    {message || "We'll be back soon"}
                </p>

                {countdown && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 inline-block">
                        <p className="text-orange-400 font-bold text-2xl tracking-wide">
                            Back in {countdown}
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500 font-mono">
                    System Status: Offline
                </div>
            </div>
        </div>
    );
}
