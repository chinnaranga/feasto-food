import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://feasto-backend-production.up.railway.app";

export default function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hi! I'm Feasto Bot 🤖. Hungry? Ask me anything about our menu!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const { currentUser } = useAuth(); // Optional: pass user context/token if needed

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const token = currentUser ? await currentUser.getIdToken() : "";

            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({ message: userMsg, history: messages })
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
            } else {
                throw new Error("No response");
            }

        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages((prev) => [...prev, { role: "assistant", text: "Oops! My brain froze 🥶. Try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[350px] h-[500px] bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-[#18181b] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Feasto AI</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090b]/50 scrollbar-thin scrollbar-thumb-white/10"
                        >
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                                max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                                ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-[#27272a] text-gray-200 rounded-bl-none border border-white/5'}
                            `}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#27272a] px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-[#18181b] border-t border-white/10">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about food..."
                                    className="flex-1 bg-[#27272a] border border-white/10 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
            w-14 h-14 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-all
            ${isOpen ? 'bg-[#27272a] hover:bg-[#3f3f46]' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'}
        `}
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
            </motion.button>
        </div>
    );
}
