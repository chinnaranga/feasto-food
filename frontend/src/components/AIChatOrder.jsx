import { useState } from "react";
import { useAIChat } from "../ai/useAIChat";

export default function AIChatOrder() {
    const [input, setInput] = useState("");
    const { sendMessage, response, loading } = useAIChat();

    const handleAsk = async (e) => {
        e.preventDefault(); // 🔴 VERY IMPORTANT
        if (!input.trim()) return;

        console.log("AI Ask:", input); // ✅ DEBUG CHECK

        try {
            await sendMessage(input);
            setInput("");
        } catch (err) {
            console.error("UI Error:", err);
            // alert(err.message); // Fallback if toast missing
        }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-[#18181b] p-6 mb-8">
            <h3 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                🤖 AI Food Assistant
            </h3>

            <form onSubmit={handleAsk} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Order something light for dinner…"
                    className="flex-1 rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 px-6 py-3 font-semibold text-orange-400 transition-colors"
                >
                    {loading ? "Thinking..." : "Ask"}
                </button>
            </form>

            {response && (
                <div className="mt-4 bg-black/30 rounded-lg p-3 text-sm border border-white/5">
                    <p className="text-orange-400 font-semibold mb-1">
                        Why this?
                    </p>
                    <p className="text-gray-300">
                        {response.recommendationReason}
                    </p>

                    {response.followUp && (
                        <p className="mt-2 text-gray-400 italic">
                            {response.followUp}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
