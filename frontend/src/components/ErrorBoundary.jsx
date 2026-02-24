import React from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#0f0f12] text-white px-6">
                    <div className="text-center max-w-md p-8 bg-[#18181b] rounded-3xl border border-white/10 shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-bold hover:opacity-90 transition text-white"
                        >
                            Refresh Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
