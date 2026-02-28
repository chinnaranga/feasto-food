import React from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    ShoppingBag,
    Clock,
    CheckCircle,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import LiquidCard from "../liquid/LiquidCard";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Dummy Data
const REVENUE_DATA = [
    { time: "10am", value: 1200 },
    { time: "12pm", value: 3400 },
    { time: "2pm", value: 2800 },
    { time: "4pm", value: 1900 },
    { time: "6pm", value: 4500 },
    { time: "8pm", value: 6800 },
    { time: "10pm", value: 5100 }
];

const RECENT_ORDERS = [
    { id: "ORD-9281", customer: "Rahul V.", items: 3, total: 850, status: "Preparing", time: "10 mins ago" },
    { id: "ORD-9280", customer: "Priya S.", items: 1, total: 320, status: "Ready", time: "15 mins ago" },
    { id: "ORD-9279", customer: "Amit M.", items: 5, total: 1640, status: "Delivered", time: "32 mins ago" },
];

export default function OverviewTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Today's Overview</h2>
                <p className="text-gray-400 text-sm mt-1">Here's what's happening at your restaurant today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value="₹25,740" trend="+15%" icon={DollarSign} color="green" />
                <StatCard title="Total Orders" value="142" trend="+8%" icon={ShoppingBag} color="blue" />
                <StatCard title="Pending" value="18" trend="-2%" icon={Clock} color="orange" />
                <StatCard title="Completed" value="120" trend="+12%" icon={CheckCircle} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <LiquidCard className="lg:col-span-2 !p-5 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity size={18} className="text-orange-500" /> Revenue Timeline
                            </h3>
                            <p className="text-sm text-gray-400">Total sales today across all platforms</p>
                        </div>
                        <select className="bg-[#18181b] border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full relative min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </LiquidCard>

                {/* Live Feed */}
                <LiquidCard className="!p-5 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Live Feed</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-green-500 tracking-wider">LIVE</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                        {RECENT_ORDERS.map((order, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={order.id}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-white">{order.id}</span>
                                    <span className="text-xs text-gray-500">{order.time}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400">{order.items} Items • {order.customer}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                                        ${order.status === 'Preparing' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                                            order.status === 'Ready' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </LiquidCard>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color }) {
    const isPositive = trend.startsWith("+");

    // Convert color prop to actual tailwind classes for liquid card glow
    const shadowColor = color === 'orange' ? 'rgba(249,115,22,0.1)' :
        color === 'green' ? 'rgba(34,197,94,0.1)' :
            color === 'blue' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)';

    return (
        <LiquidCard className="!p-5 hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group" style={{ boxShadow: `0 8px 32px ${shadowColor}` }}>
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Icon size={40} className={`text-${color}-500/20`} />
            </div>
            <div className="relative z-10">
                <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
                <div className="flex items-center gap-2 mt-3 text-xs font-semibold">
                    <span className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </span>
                    <span className="text-gray-500">vs yesterday</span>
                </div>
            </div>
        </LiquidCard>
    );
}
