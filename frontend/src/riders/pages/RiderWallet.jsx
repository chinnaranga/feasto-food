import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Wallet,
    IndianRupee,
    Calendar,
    CheckCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function RiderWallet() {
    const { currentUser, userToken } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalEarnings: 0,
        todayEarnings: 0,
        completedDeliveries: 0
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userToken) return;

        const fetchWalletData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rider/earnings`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });

                setStats({
                    totalEarnings: parseFloat(res.data.balance) || 0,
                    todayEarnings: parseFloat(res.data.today) || 0,
                    completedDeliveries: res.data.totalOrders || 0
                });
                setHistory(res.data.recentTransactions || []);
            } catch (err) {
                console.error("Wallet fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, [userToken]);

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-safe">
            {/* Header */}
            <div className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center gap-3 border-b border-gray-700">
                <button
                    onClick={() => navigate('/rider/dashboard')}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-300" />
                </button>
                <h1 className="font-bold text-lg">My Wallet</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* 1. Total Balance Card */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-emerald-100 text-sm font-medium mb-1">Total Earnings</p>
                        <h2 className="text-4xl font-bold flex items-center">
                            <IndianRupee className="w-8 h-8 mr-1" />
                            {stats.totalEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <div className="mt-4 flex gap-3">
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                Withdraw
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                History
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Today</span>
                        </div>
                        <p className="text-2xl font-bold text-white flex items-center">
                            <IndianRupee className="w-5 h-5 text-gray-500" />
                            {stats.todayEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Delivered</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {stats.completedDeliveries || 0}
                        </p>
                    </div>
                </div>

                {/* 3. Recent History */}
                <div>
                    <h3 className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                        {loading ? <p className="text-xs text-gray-500">Loading...</p> : history.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No deliveries yet.</p>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-200">
                                                {item.restaurantName || "Delivery"}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>Order #{item.id.slice(-4).toUpperCase()}</span>
                                                {item.date && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-400 flex items-center">
                                        +<IndianRupee className="w-3 h-3" />{item.amount}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
