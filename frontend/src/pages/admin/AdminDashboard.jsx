import React from 'react';

import LiquidCard from '../../components/liquid/LiquidCard';
import LiquidBackground from '../../components/liquid/LiquidBackground';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <--- Import useAuth

// Mock Data
export default function AdminDashboard() {
    const { currentUser, userToken } = useAuth(); // Using userToken if available, else currentUser.getIdToken()
    const [stats, setStats] = React.useState({
        rpm: 0,
        ordersToday: 0,
        activeOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        trafficGraph: [],
        revenueGraph: []
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!currentUser) return;
                const token = userToken || await currentUser.getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [currentUser, userToken]);

    return (
        <LiquidBackground>
            <div className="relative z-10 mx-auto max-w-7xl p-6 md:p-10 space-y-8 fade-in-up">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400">Real-time system insights for Production Cluster A.</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <LiquidCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500"><Activity className="w-6 h-6" /></div>
                            <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> Live
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Requests (RPM)</h3>
                        <p className="text-3xl font-bold text-white font-mono">{stats.rpm}</p>
                    </LiquidCard>

                    <LiquidCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500"><ShoppingBag className="w-6 h-6" /></div>
                            <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> Active
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Active Orders</h3>
                        <p className="text-3xl font-bold text-white font-mono">{stats.activeOrders}</p>
                    </LiquidCard>

                    <LiquidCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Users className="w-6 h-6" /></div>
                            <span className="flex items-center text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">
                                <ArrowDownRight className="w-3 h-3 mr-1" /> Total
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Users</h3>
                        <p className="text-3xl font-bold text-white font-mono">{stats.totalUsers}</p>
                    </LiquidCard>

                    <LiquidCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Users className="w-6 h-6" /></div> {/* Reusing icon, maybe Change later */}
                            <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> Today
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Revenue Today</h3>
                        {/* Note: revenueGraph last item might be today, or compute separate revenueToday in backend. 
                            For now, let's use Orders Today count for simple comparison with previous card */}
                        <p className="text-3xl font-bold text-white font-mono">{stats.ordersToday} <span className="text-sm text-gray-500 font-sans">Orders</span></p>
                    </LiquidCard>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Traffic Chart */}
                    <LiquidCard className="p-6">
                        <h3 className="text-white font-bold mb-6">API Traffic (Last 24h)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart data={stats.trafficGraph}>
                                    <defs>
                                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="requests" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </LiquidCard>

                    {/* Revenue/Orders Chart */}
                    <LiquidCard className="p-6">
                        <h3 className="text-white font-bold mb-6">Revenue (Last 7 Days)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={stats.revenueGraph}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </LiquidCard>

                </div>

            </div>
        </LiquidBackground>
    );
}
