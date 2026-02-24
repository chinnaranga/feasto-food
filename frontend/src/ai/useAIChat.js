import { useState } from "react";

export function useAIChat() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    async function sendMessage(message) {
        setLoading(true);

        try {
            const url = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/ai/chat-order`;
            console.log("Calling AI:", url); // Debug log

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            }
            );

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "AI processing failed");
            }

            setResponse(data.ai);
            return data.ai;
        } catch (err) {
            console.error("AI chat error:", err);
            throw err; // Re-throw for UI to handle
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, response, loading };
}
