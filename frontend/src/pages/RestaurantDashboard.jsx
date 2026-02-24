import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import {
    Store,
    ShoppingBag,
    Clock,
    CheckCircle,
    ShieldAlert,
    Power,
    Utensils,
    List
} from "lucide-react";
import toast from "react-hot-toast";
import MenuManager from "../components/restaurant/MenuManager";
import { motion, AnimatePresence } from "framer-motion";
import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";

import { useRealtimeOrders } from "../hooks/useRealtimeOrders";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function RestaurantDashboard() {
    const { currentUser, userData } = useAuth();
    const [activeTab, setActiveTab] = useState("orders"); // orders | menu
    const [restaurant, setRestaurant] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // We need the restaurant ID for the hook.
    const { orders, loading: ordersLoading, updateStatus } = useRealtimeOrders(restaurant?.id);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!currentUser) return;
            try {
                // Force refresh token to ensure we have the latest claims
                const token = await currentUser.getIdToken(true);
                const res = await fetch(`${API_URL}/api/restaurant/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.status === 401) {
                    console.error("Unauthorized access to restaurant API");
                    toast.error("Session invalid. Please login again.");
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setRestaurant(data);
                    setIsOpen(data.isOpen);
                } else {
                    console.error("Failed to fetch restaurant data", res.status);
                }
            } catch (err) {
                console.error("Failed to fetch restaurant", err);
                toast.error("Connection error. Please try again.");
            }
        };
        fetchRestaurant();
    }, [currentUser]);

    const updateStatusAction = async (orderId, status) => {
        const success = await updateStatus(orderId, status);
        if (success) toast.success(`Order marked as ${status}`);
        else toast.error("Failed to update status");
    };

    const toggleStatus = async () => {
        try {
            const token = await currentUser.getIdToken();
            const newStatus = !isOpen;

            const res = await fetch(`${API_URL}/api/restaurant/toggle`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isOpen: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");

            setIsOpen(newStatus);
            toast.success(newStatus ? "Restaurant is now OPEN 🟢" : "Restaurant is now CLOSED 🔴");

        } catch (err) {
            toast.error(err.message);
        }
    };

    if ((!restaurant && !ordersLoading) || ordersLoading) {
        return (
            <LiquidBackground className="flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            </LiquidBackground>
        );
    }

    return (
        <LiquidBackground>
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
                <div className="space-y-8">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3 text-white mb-2">
                                <Store className="text-orange-500" size={32} />
                                {restaurant?.name || "Restaurant Dashboard"}
                            </h1>
                            <p className="text-gray-400 text-lg">Manage your orders and menu in real-time</p>
                        </div>

                        <LiquidCard className="!p-3 !bg-white/5 flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${isOpen ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {isOpen ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                                {isOpen ? "OPEN FOR ORDERS" : "CLOSED"}
                            </div>
                            <button
                                onClick={toggleStatus}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors border border-white/10"
                                title="Toggle Open/Close Status"
                            >
                                <Power size={20} className={isOpen ? "text-red-400" : "text-green-400"} />
                            </button>
                        </LiquidCard>
                    </header>

                    {/* Navigation Tabs */}
                    <div className="flex gap-6 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`pb-4 px-2 text-base font-bold flex items-center gap-2 transition-all relative ${activeTab === 'orders' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ShoppingBag size={20} /> Orders
                            {activeTab === 'orders' && (
                                <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("menu")}
                            className={`pb-4 px-2 text-base font-bold flex items-center gap-2 transition-all relative ${activeTab === 'menu' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Utensils size={20} /> Menu Management
                            {activeTab === 'menu' && (
                                <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'orders' ? (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <LiquidCard className="flex items-center gap-6" hoverEffect={true}>
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                            <ShoppingBag size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 font-medium">Total Orders</h3>
                                            <p className="text-4xl font-bold text-white mt-1">{orders.length}</p>
                                        </div>
                                    </LiquidCard>

                                    <LiquidCard className="flex items-center gap-6 relative overflow-hidden" hoverEffect={true}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] z-10">
                                            <Clock size={28} />
                                        </div>
                                        <div className="z-10">
                                            <h3 className="text-gray-400 font-medium">Pending</h3>
                                            <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent mt-1">
                                                {orders.filter(o => ['pending', 'preparing'].includes(o.status)).length}
                                            </p>
                                        </div>
                                    </LiquidCard>

                                    <LiquidCard className="flex items-center gap-6" hoverEffect={true}>
                                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                                            <CheckCircle size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-400 font-medium">Completed</h3>
                                            <p className="text-4xl font-bold text-white mt-1">
                                                {orders.filter(o => ['picked_up', 'delivered'].includes(o.status)).length}
                                            </p>
                                        </div>
                                    </LiquidCard>
                                </div>

                                {/* Orders List */}
                                <LiquidCard className="!p-0 overflow-hidden">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                            <h2 className="text-xl font-bold text-white">Live Orders</h2>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            REALTIME FEED
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                                                    <th className="p-6 font-semibold">Order ID</th>
                                                    <th className="p-6 font-semibold">Time</th>
                                                    <th className="p-6 font-semibold">Status</th>
                                                    <th className="p-6 font-semibold">Items</th>
                                                    <th className="p-6 font-semibold">Total</th>
                                                    <th className="p-6 font-semibold text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {orders.map(order => (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        key={order.id}
                                                        className="hover:bg-white/[0.02] transition-colors group"
                                                    >
                                                        <td className="p-6 font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
                                                            #{order.displayId || order.id.slice(-6)}
                                                        </td>
                                                        <td className="p-6 text-sm text-gray-400">
                                                            {order.createdAt ? format(new Date(order.createdAt), "h:mm a") : "Just now"}
                                                        </td>
                                                        <td className="p-6">
                                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${order.status === 'ready' || order.status === 'picked_up'
                                                                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                                                : order.status === 'cancelled' || order.status === 'rejected'
                                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                    : order.status === 'preparing'
                                                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]'
                                                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                }`}>
                                                                {order.status.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-sm text-gray-300">
                                                            <div className="space-y-1">
                                                                {order.items?.map((i, idx) => (
                                                                    <div key={idx} className="flex gap-2 text-xs md:text-sm">
                                                                        <span className="font-bold text-orange-400">{i.quantity}x</span>
                                                                        <span>{i.name}</span>
                                                                    </div>
                                                                )) || "No items"}
                                                            </div>
                                                        </td>
                                                        <td className="p-6 font-bold text-white text-lg">
                                                            ₹{order.total}
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="flex gap-3 justify-end">
                                                                {order.status === 'pending' && (
                                                                    <>
                                                                        <LiquidButton
                                                                            onClick={() => updateStatusAction(order.id, 'preparing')}
                                                                            variant="primary"
                                                                            className="!py-2 !px-4 !text-xs !rounded-xl"
                                                                        >
                                                                            Accept
                                                                        </LiquidButton>
                                                                        <LiquidButton
                                                                            onClick={() => updateStatusAction(order.id, 'rejected')}
                                                                            variant="danger"
                                                                            className="!py-2 !px-4 !text-xs !rounded-xl opacity-80 hover:opacity-100"
                                                                        >
                                                                            Reject
                                                                        </LiquidButton>
                                                                    </>
                                                                )}
                                                                {order.status === 'preparing' && (
                                                                    <LiquidButton
                                                                        onClick={() => updateStatusAction(order.id, 'ready')}
                                                                        variant="primary"
                                                                        className="!py-2 !px-4 !text-xs !rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20"
                                                                    >
                                                                        Mark Ready
                                                                    </LiquidButton>
                                                                )}
                                                                {order.status === 'ready' && (
                                                                    <div className="flex items-center gap-2 text-xs text-yellow-400 animate-pulse bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]">
                                                                        <Clock size={16} />
                                                                        <span>Waiting for Pickup</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                                {orders.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="p-20 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                                                                    <ShoppingBag className="text-gray-600" size={32} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-lg text-gray-400">No live orders right now</p>
                                                                    <p className="text-sm text-gray-600 mt-1">New orders will appear here automatically</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </LiquidCard>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <MenuManager />
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </LiquidBackground>
    );
}
