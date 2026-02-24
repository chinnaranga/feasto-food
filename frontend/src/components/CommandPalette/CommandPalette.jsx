import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { COMMANDS } from "./commands";
import { useCommandPalette } from "./useCommandPalette";
import useCart from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { pickBestRestaurant, explainPick } from "../../ai/foodDecisionEngine";
import { mockFoodData } from "../../data/mockData";
import toast from "react-hot-toast";

import { useAppContext } from "../../context/AppContext";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const { currentUser } = useAuth();
    const { state, dispatch } = useAppContext(); // Need dispatch here

    useCommandPalette(open, setOpen);

    // --- LOGIC ---

    const guardedNavigate = (path) => {
        if (!currentUser && (path === "/cart" || path === "/checkout")) {
            navigate("/login");
        } else {
            navigate(path);
        }
        setOpen(false);
    };

    const intentRouter = (q) => {
        const lowerQ = q.toLowerCase();
        if (lowerQ.includes("pizza")) return { type: "search", value: "pizza" };
        if (lowerQ.includes("burger")) return { type: "search", value: "burger" };
        if (lowerQ.includes("healthy")) return { type: "filter", value: "healthy" };
        if (lowerQ.includes("fast")) return { type: "filter", value: "fast" };
        if (lowerQ.includes("cheap")) return { type: "filter", value: "offers" };
        if (lowerQ.includes("cart")) return { type: "nav", value: "/cart" };
        if (lowerQ.includes("checkout")) return { type: "nav", value: "/checkout" };
        return null;
    };

    const handleSmartAction = (q) => {
        const intent = intentRouter(q);
        if (intent) {
            if (intent.type === "nav") {
                guardedNavigate(intent.value);
            } else {
                navigate(
                    `/dashboard?${intent.type === "search" ? "search" : "filter"}=${intent.value
                    }`
                );
                setOpen(false);
            }
            return true;
        }
        return false;
    };

    const aiSuggestions = [
        {
            title: "🍕 Comfort food under 30 mins",
            action: () => navigate("/dashboard?filter=fast"),
        },
        {
            title: "🥗 Healthy & high-protein",
            action: () => navigate("/dashboard?filter=healthy"),
        },
        {
            title: "🔥 Trending near you",
            action: () => navigate("/dashboard?sort=trending"),
        },
        {
            title: "⭐ Top rated tonight",
            action: () => navigate("/dashboard?sort=rating"),
        },
    ];

    const filtered = useMemo(() => {
        // Dynamic updates (e.g. Cart count)
        const dynamicCommands = COMMANDS.map((cmd) => {
            if (cmd.id === "cart") {
                return {
                    ...cmd,
                    title: `Open Cart ${cartItems.length > 0 ? `(${cartItems.length})` : ""
                        }`,
                };
            }
            return cmd;
        });

        if (!query) return [];

        return dynamicCommands.filter((cmd) =>
            cmd.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, cartItems]);

    const handleCommandSelect = (cmd) => {
        setOpen(false);
        if (cmd.intent === "ai") {
            // AI Decision Engine Trigger
            const best = pickBestRestaurant(mockFoodData);

            if (best) {
                toast.success(
                    `🤖 AI picked ${best.name}\n${explainPick(best)}`,
                    { duration: 5000, icon: "✨" }
                );
                // Ideally filter for this restaurant or go to details
                navigate(`/dashboard?search=${best.name}`);
            } else {
                toast.error("AI couldn't find a match right now.");
            }
            return;
        }

        if (cmd.action) {
            if (cmd.id === "cart" || cmd.id === "checkout") {
                guardedNavigate(cmd.id === "cart" ? "/cart" : "/checkout");
            } else {
                cmd.action(navigate);
            }
        } else if (cmd.intent === "food") {
            // Should ideally map to a filter, for now just go to dashboard
            navigate('/dashboard');
        }
    };

    // --- KEYBOARD NAV ---

    useEffect(() => {
        if (!open) {
            setQuery("");
            setActiveIndex(0);
            return;
        }

        const handler = (e) => {
            // List to navigate: if query is empty => aiSuggestions + first 3 commands
            // if query is present => filtered
            const listLength = !query
                ? aiSuggestions.length + Math.min(COMMANDS.length, 3)
                : filtered.length;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % (listLength || 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => (i - 1 + (listLength || 1)) % (listLength || 1));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (query) {
                    const handled = handleSmartAction(query);
                    if (!handled && filtered[activeIndex]) {
                        handleCommandSelect(filtered[activeIndex]);
                    }
                } else {
                    // Selecting from default list
                    if (activeIndex < aiSuggestions.length) {
                        setOpen(false);
                        aiSuggestions[activeIndex].action();
                    } else {
                        const cmdIndex = activeIndex - aiSuggestions.length;
                        handleCommandSelect(COMMANDS[cmdIndex]);
                    }
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, query, filtered, activeIndex, aiSuggestions]); // Dependencies need to be stable

    // --- RENDER ---

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="fixed top-[15%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 rounded-3xl bg-[#18181b] border border-white/10 shadow-2xl"
                    >
                        {/* Input */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                            <Search className="text-gray-400" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What should I eat?"
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                            />
                            <span className="text-xs text-gray-500">ESC</span>
                        </div>

                        {/* Results */}
                        <div className="max-h-[360px] overflow-y-auto p-2">
                            {!query && (
                                <>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        AI Suggestions
                                    </div>
                                    {aiSuggestions.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setOpen(false);
                                                item.action();
                                            }}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${activeIndex === i ? "bg-white/10" : "hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="p-2 rounded-xl bg-white/5">
                                                <Sparkles className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <p className="font-medium text-white">{item.title}</p>
                                        </button>
                                    ))}

                                    <div className="mt-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Quick Links
                                    </div>
                                    {COMMANDS.slice(0, 3).map((cmd, i) => {
                                        const Icon = cmd.icon;
                                        // Offset index by length of aiSuggestions
                                        const globalIndex = i + aiSuggestions.length;

                                        // Dynamic cart count (only for cart)
                                        let title = cmd.title;
                                        if (cmd.id === 'cart' && cartItems.length > 0) {
                                            title = `Open Cart (${cartItems.length})`;
                                        }

                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={() => handleCommandSelect(cmd)}
                                                onMouseEnter={() => setActiveIndex(globalIndex)}
                                                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${activeIndex === globalIndex
                                                    ? "bg-white/10"
                                                    : "hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className="p-2 rounded-xl bg-white/5">
                                                    <Icon className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-white">{title}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {cmd.subtitle}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </>
                            )}

                            {query && filtered.length === 0 && (
                                <div className="p-6 text-center text-gray-400">
                                    No results found for "{query}"
                                </div>
                            )}

                            {query &&
                                filtered.map((cmd, index) => {
                                    const Icon = cmd.icon;
                                    const isSelected = index === activeIndex;
                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={() => handleCommandSelect(cmd)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${isSelected ? "bg-white/10" : "hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="p-2 rounded-xl bg-white/5">
                                                <Icon
                                                    className={`w-5 h-5 ${cmd.intent === "ai"
                                                        ? "text-purple-400"
                                                        : "text-orange-400"
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{cmd.title}</p>
                                                <p className="text-sm text-gray-400">{cmd.subtitle}</p>
                                            </div>
                                            {cmd.intent === "ai" && (
                                                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                                                    AI
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                        </div>

                        {/* Footer Hints */}
                        <div className="flex justify-between text-xs text-gray-400 px-6 py-3 border-t border-white/10 bg-white/5 rounded-b-3xl">
                            <span className="flex items-center gap-1">
                                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-sans">
                                    ↑↓
                                </kbd>{" "}
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-sans">
                                    ↵
                                </kbd>{" "}
                                Select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-sans">
                                    Esc
                                </kbd>{" "}
                                Close
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
