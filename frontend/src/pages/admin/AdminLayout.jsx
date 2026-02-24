import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, AlertTriangle, Users, FileText, LogOut, Bike, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LiquidContainer from '../../components/liquid/LiquidContainer';
import LiquidButton from '../../components/liquid/LiquidButton';

const NAV_ITEMS = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Traffic', icon: BarChart3, path: '/admin/traffic' },
    { label: 'Alerts', icon: AlertTriangle, path: '/admin/alerts' },
    { label: 'Riders', icon: Bike, path: '/admin/riders' },
    { label: 'Tools', icon: Wrench, path: '/admin/tools' },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
            localStorage.removeItem('accessToken'); // Ensure AdminRoute guard is cleared
            navigate('/admin/login');
        } catch (error) {
            console.error("Failed to sign out", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0B0F14] text-white relative flex overflow-hidden">
            {/* Background Effects (similar to LiquidContainer but optimized for Layout) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000" />
            </div>

            {/* Sidebar (Glass) */}
            <aside className="w-64 fixed h-screen z-20 hidden md:flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-2xl">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/20">A</div>
                    <span className="text-white font-bold text-lg tracking-tight">AeroBite Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)]'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-slate-500 group-hover:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                    <div className="mt-4 px-2 text-xs text-slate-600 font-mono">
                        v2.0.0 • LIQUID
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative z-10 flex flex-col min-h-screen overflow-y-auto">
                {/* Navbar (Mobile/Header) */}
                <header className="h-16 border-b border-white/5 bg-black/10 backdrop-blur-xl sticky top-0 px-6 flex items-center justify-between z-30">
                    <h2 className="text-white font-medium capitalize flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {location.pathname.split('/').pop()}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-green-400 tracking-wide">SYSTEM OPTIMAL</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                            AD
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
