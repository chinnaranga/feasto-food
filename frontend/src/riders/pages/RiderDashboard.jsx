import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Power, Navigation, Clock, CheckCircle, XCircle, Wallet } from 'lucide-react';
import axios from 'axios';

import LiquidBackground from '../../components/liquid/LiquidBackground';
import LiquidCard from '../../components/liquid/LiquidCard';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function RiderDashboard() {
    const { currentUser, userToken } = useAuth();
    const navigate = useNavigate();
    const [riderStatus, setRiderStatus] = useState('offline');
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalEarnings: 0, completedOrders: 0 });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${userToken}` }
    });

    // 1. Fetch Rider Profile & Status
    const fetchProfile = async () => {
        if (!userToken) return;
        try {
            const res = await axios.get(`${API_URL}/api/rider/profile`, getAuthHeaders());
            setRiderStatus(res.data.status);
            setStats({
                totalEarnings: res.data.totalEarnings || 0,
                completedOrders: 0 // We might need to add this to backend response
            });
            // If rider has an active order, redirect
            if (res.data.activeOrderId) {
                // navigate(`/rider/active/${res.data.activeOrderId}`);
            }
        } catch (error) {
            console.error("Fetch Profile Error", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userToken]);

    // 2. Poll for Available Orders (Hybrid: Pool Model)
    useEffect(() => {
        if (!userToken || riderStatus === 'offline') return;

        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rider/orders/available`, getAuthHeaders());
                setOrders(res.data);
            } catch (error) {
                console.error("Fetch Orders Error", error);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [userToken, riderStatus]);

    // 3. Continuous Location Sync (When Online)
    useEffect(() => {
        if (!userToken || riderStatus === 'offline' || !navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(async (pos) => {
            try {
                await axios.patch(`${API_URL}/api/rider/location`, {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    heading: pos.coords.heading,
                    speed: pos.coords.speed
                }, getAuthHeaders());
            } catch (e) {
                // console.error("Loc sync fail", e);
            }
        }, err => console.error(err), { enableHighAccuracy: true });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [userToken, riderStatus]);

    const handleStatusToggle = async () => {
        const newStatus = riderStatus === 'offline' ? 'online' : 'offline';
        try {
            const res = await axios.patch(`${API_URL}/api/rider/status`, { status: newStatus }, getAuthHeaders());
            setRiderStatus(res.data.status);
            toast.success(newStatus === 'online' ? "You are now ONLINE 🟢" : "You are going OFFLINE 🔴");
        } catch (e) {
            toast.error("Status update failed");
            console.error(e);
        }
    };

    const handleAccept = async (orderId) => {
        try {
            await axios.post(`${API_URL}/api/rider/orders/${orderId}/accept`, {}, getAuthHeaders());
            toast.success("Order Accepted! 🚀");
            navigate(`/rider/active/${orderId}`);
        } catch (error) {
            toast.error("Failed to accept order");
            console.error(error);
        }
    };

    const isOnline = riderStatus !== 'offline';

    return (
        <LiquidBackground className="pb-24 font-sans relative overflow-x-hidden">

            {/* Header */}
            <div className="flex justify-between items-center p-6 sticky top-0 bg-[#0f0f12]/80 backdrop-blur-xl z-40 border-b border-white/5">
                <div>
                    <h2 className="font-bold text-xl tracking-tight flex items-center gap-2 text-white">
                        AeroBite<span className="text-orange-500">Rider</span>
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Partner App</p>
                </div>

                <motion.div
                    layout
                    className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border ${isOnline ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                >
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {riderStatus === 'available' || riderStatus === 'online' ? 'ONLINE' : riderStatus === 'busy' ? 'BUSY' : 'OFFLINE'}
                </motion.div>
            </div>

            <div className="max-w-[420px] mx-auto px-4 pt-6 space-y-6 relative z-10">

                {/* Earning Stats (Mini) */}
                {isOnline && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <LiquidCard className="p-4 flex items-center justify-between" hoverEffect={true}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                    <Wallet size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase">Today's Earnings</p>
                                    <p className="text-lg font-bold text-white">₹{stats.totalEarnings?.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{stats.completedOrders} orders</p>
                            </div>
                        </LiquidCard>
                    </motion.div>
                )}

                {/* 1. Offline & Online Empty State */}
                <AnimatePresence mode="wait">
                    {(!isOnline || (isOnline && orders.length === 0)) && (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <LiquidCard className="p-10 text-center relative overflow-hidden">
                                {/* Glow Effect */}
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] pointer-events-none ${isOnline ? 'bg-green-500/20' : 'bg-red-500/10'}`} />

                                <motion.div
                                    animate={{ scale: isOnline ? [1, 1.1, 1] : 1 }}
                                    transition={{ repeat: isOnline ? Infinity : 0, duration: 2 }}
                                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 relative z-10 border-4 ${isOnline ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-800/50 border-white/5'}`}
                                >
                                    <Power className={`w-10 h-10 ${isOnline ? 'text-green-500' : 'text-gray-500'}`} />
                                </motion.div>

                                <h3 className="text-white text-xl font-bold relative z-10">
                                    {isOnline ? "Looking for Orders..." : "You're Offline"}
                                </h3>
                                <p className="text-gray-400 text-sm mt-2 max-w-[250px] mx-auto relative z-10">
                                    {isOnline ? "Stay near hotspots to get more delivery requests." : "Go online to start receiving orders and earning."}
                                </p>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleStatusToggle}
                                    className={`mt-8 w-full font-bold py-4 rounded-xl transition-all relative z-10 shadow-lg ${isOnline
                                        ? 'bg-[#18181b] border border-red-500/30 text-red-400 hover:bg-red-500/10'
                                        : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                >
                                    {isOnline ? "Go Offline" : "GO ONLINE"}
                                </motion.button>
                            </LiquidCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. Active Orders List */}
                <div className="space-y-4">
                    {orders.length > 0 && <p className="text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">New Requests ({orders.length})</p>}
                    <AnimatePresence>
                        {orders.map(order => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <LiquidCard className="p-5 relative overflow-hidden group" hoverEffect={true}>
                                    {/* High Priority Indicator */}
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>

                                    <div className="flex justify-between items-start mb-4 pl-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="bg-orange-500/20 text-orange-400 p-1 rounded-md"><Navigation size={12} /></div>
                                                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Pickup Request</p>
                                            </div>
                                            <h4 className="text-white font-bold text-lg">{order.items?.[0]?.name ? `${order.items[0].name} +${order.items.length - 1} more` : "Order #" + order._id.slice(-6)}</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-white block">₹{Math.round((order.total || 100) * 0.15)}</span>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Est. Earn</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 pl-3">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 flex flex-col items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-white/50" />
                                                <div className="w-0.5 h-6 bg-white/10" />
                                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Details</p>
                                                    <p className="text-sm text-gray-300 line-clamp-1">{order.items?.length || 0} items for ₹{order.total}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                                    <p className="text-sm text-white font-medium line-clamp-1">{order.status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-300">
                                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                                <span>~25 mins</span>
                                            </div>
                                            <div className="w-px h-3 bg-white/10" />
                                            <div className="flex items-center gap-1.5 text-xs text-gray-300">
                                                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                                                <span>4.5 km</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pl-3">
                                        <button
                                            onClick={() => handleAccept(order._id)}
                                            className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Accept Order
                                        </button>
                                        <button className="flex-1 bg-[#27272a] hover:bg-red-500/20 text-gray-400 hover:text-red-400 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 border border-white/5">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </LiquidCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </LiquidBackground>
    );
}
