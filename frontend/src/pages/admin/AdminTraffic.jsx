import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Activity, Zap, Server } from 'lucide-react';
import LiquidCard from '../../components/liquid/LiquidCard';
import { useAuth } from '../../context/AuthContext';

export default function AdminTraffic() {
    const { currentUser } = useAuth();
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({
        rpm: 0,
        avgLatency: 45, // Mock baseline
        peakRpm: 0,
        totalRequests: 0
    });

    useEffect(() => {
        const interval = setInterval(fetchStats, 5000);
        fetchStats(); // Initial fetch
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            if (!currentUser) return;
            const token = await currentUser.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const apiData = await res.json();
                const now = new Date();
                const timeStr = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

                // Update real-time chart data
                setData(prev => {
                    const newData = [...prev, { name: timeStr, rpm: apiData.rpm || 0 }];
                    if (newData.length > 20) newData.shift(); // Keep last 20 points
                    return newData;
                });

                // Update aggregate stats
                setStats(prev => ({
                    rpm: apiData.rpm || 0,
                    avgLatency: 40 + Math.random() * 20, // Simulated variation
                    peakRpm: Math.max(prev.peakRpm, apiData.rpm || 0),
                    totalRequests: prev.totalRequests + (apiData.requestsInterim || 0)
                }));
            }
        } catch (error) {
            console.error("Traffic stats error:", error);
        }
    };

    return (
        <div className="space-y-8 fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Traffic Analytics</h1>
                <p className="text-gray-400">Real-time inspection of incoming API requests.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <LiquidCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Activity className="w-6 h-6" /></div>
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Live</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{stats.rpm}</div>
                    <div className="text-sm text-gray-400 mt-1">Current RPM</div>
                </LiquidCard>

                <LiquidCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500"><Zap className="w-6 h-6" /></div>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{Math.round(stats.avgLatency)}ms</div>
                    <div className="text-sm text-gray-400 mt-1">Avg Latency</div>
                </LiquidCard>

                <LiquidCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500"><ArrowUpRight className="w-6 h-6" /></div>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{stats.peakRpm}</div>
                    <div className="text-sm text-gray-400 mt-1">Peak RPM (Session)</div>
                </LiquidCard>

                <LiquidCard className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Server className="w-6 h-6" /></div>
                    </div>
                    <div className="text-3xl font-bold text-white font-mono">{stats.totalRequests}</div>
                    <div className="text-sm text-gray-400 mt-1">Total Requests</div>
                </LiquidCard>
            </div>

            {/* Main Chart */}
            <LiquidCard className="p-6">
                <h3 className="text-white font-bold mb-6">Live Traffic Stream</h3>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="rpm"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRpm)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </LiquidCard>
        </div>
    );
}
