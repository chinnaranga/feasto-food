import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function RiderEarnings() {
    const { currentUser, userToken } = useAuth();
    const [stats, setStats] = useState({ balance: 0, today: 0, week: 0, orders: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userToken) return;

        const fetchEarnings = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/rider/earnings`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });

                setStats({
                    balance: res.data.balance || 0,
                    today: res.data.today || 0,
                    week: res.data.week || 0,
                    orders: res.data.totalOrders || 0
                });
                setTransactions(res.data.recentTransactions || []);
            } catch (err) {
                console.error("Earnings fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [userToken]);

    return (
        <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] flex justify-center font-sans pb-24">
            <div className="w-full max-w-[390px] px-4 pt-8">

                <h2 className="text-white font-semibold mb-6 text-xl">Earnings</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <StatBox value={`₹${stats.today}`} label="Today" />
                    <StatBox value={`₹${stats.balance}`} label="Balance" />
                    <StatBox value={stats.orders} label="Orders" />
                </div>

                {/* Payout Card */}
                <div className="bg-[#111A2E] rounded-xl p-5 mt-6 border border-white/5 shadow-lg">
                    <p className="text-gray-400 text-sm">
                        Next payout: <span className="text-white font-semibold">Monday, 9:00 AM</span>
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Bank Account</span>
                        <span className="text-xs font-mono text-gray-300">•••• 4821</span>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Recent Trips</h3>
                    <div className="space-y-3">
                        {loading ? <p className="text-xs text-gray-500">Loading history...</p> : transactions.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No recent transactions</p>
                        ) : (
                            transactions.map(txn => (
                                <div key={txn.id} className="flex justify-between items-center py-3 border-b border-white/5">
                                    <div>
                                        <p className="text-white text-sm font-medium">{txn.description}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className="text-[#22C55E] font-bold text-sm">+₹{txn.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatBox({ value, label }) {
    return (
        <div className="bg-[#111A2E] rounded-xl p-4 text-center border border-white/5 flex flex-col justify-center min-h-[100px]">
            <span className="text-white text-lg font-bold block mb-1">{value}</span>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
    );
}
