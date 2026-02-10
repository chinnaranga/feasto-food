import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, AlertTriangle, Users, FileText, LogOut, Bike, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
        <div className="min-h-screen bg-[#020617] flex antialiased selection:bg-orange-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Sidebar (Glass) */}
            <aside className="w-64 fixed h-screen z-20 hidden md:flex flex-col border-r border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-white font-bold text-lg tracking-tight">AeroBite Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-500 group-hover:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                    <div className="mt-4 px-2 text-xs text-slate-600 font-mono">
                        v1.2.0 • PROD
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative z-10">
                {/* Navbar (Mobile/Header) */}
                <header className="h-16 border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 px-6 flex items-center justify-between z-30">
                    <h2 className="text-white font-medium capitalize">{location.pathname.split('/').pop()}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-500">SYSTEM HEALTHY</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10"></div>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
