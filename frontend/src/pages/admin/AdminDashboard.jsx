import React from 'react';

import { GlassCard } from '../../components/admin/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // <--- Import useAuth

// Mock Data
const TRAFFIC_DATA = [
    { name: '00:00', requests: 400 },
    { name: '04:00', requests: 300 },
    { name: '08:00', requests: 2000 },
    { name: '12:00', requests: 3500 },
    { name: '16:00', requests: 2800 },
    { name: '20:00', requests: 4200 },
    { name: '23:59', requests: 1200 },
];

const ORDERS_DATA = [
    { name: 'Mon', orders: 120 },
    { name: 'Tue', orders: 150 },
    { name: 'Wed', orders: 180 },
    { name: 'Thu', orders: 220 },
    { name: 'Fri', orders: 350 },
    { name: 'Sat', orders: 480 },
    { name: 'Sun', orders: 410 },
];

export default function AdminDashboard() {
    const { currentUser } = useAuth(); // <--- Use useAuth
    const [stats, setStats] = React.useState({
        rpm: 0,
        ordersToday: 0,
        activeOrders: 0,
        totalUsers: 0,
        errorRate: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!currentUser) return;
                const token = await currentUser.getIdToken();
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
    }, [currentUser]);

    return (
        <div className="space-y-8 fade-in-up">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Real-time system insights for Production Cluster A.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500"><Activity className="w-6 h-6" /></div>
                        <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> Live
                        </span>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Requests (RPM)</h3>
                    <p className="text-4xl font-bold text-white font-mono">{stats.rpm}</p>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500"><ShoppingBag className="w-6 h-6" /></div>
                        <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> Active
                        </span>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Active Orders</h3>
                    <p className="text-4xl font-bold text-white font-mono">{stats.activeOrders}</p>
                </GlassCard>

                <GlassCard className="p-6 relative overflow-hidden" hoverEffect={true}>
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Users className="w-6 h-6" /></div>
                        <span className="flex items-center text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">
                            <ArrowDownRight className="w-3 h-3 mr-1" /> Total
                        </span>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Orders Today</h3>
                    <p className="text-4xl font-bold text-white font-mono">{stats.ordersToday}</p>
                </GlassCard>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Traffic Chart */}
                <GlassCard className="p-6">
                    <h3 className="text-white font-bold mb-6">API Traffic</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TRAFFIC_DATA}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Orders Chart */}
                <GlassCard className="p-6">
                    <h3 className="text-white font-bold mb-6">Orders this Week</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ORDERS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

            </div>

        </div>
    );
}
