import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Bike,
    Store,
    Settings,
    LogOut,
    Menu,
    X,
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    const navItems = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
        { path: "/admin/riders", label: "Riders Force", icon: Bike },
        // Placeholder routes for now, can be added later as actual pages
        // { path: "/admin/restaurants", label: "Restaurants", icon: Store },
        // { path: "/admin/users", label: "User Base", icon: Users },
        { path: "/admin/tools", label: "System Tools", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#0f0f12] text-white font-sans overflow-hidden">

            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-[#18181b] border-r border-white/5 flex flex-col relative z-20 h-screen transition-all duration-300"
            >
                {/* Brand */}
                <div className={`h-20 flex items-center ${isSidebarOpen ? 'px-8' : 'justify-center'} border-b border-white/5`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                            <Shield className="text-white fill-white/20" size={20} />
                        </div>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl tracking-tight"
                            >
                                AeroBite<span className="text-orange-500">Admin</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                                ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <item.icon size={20} className={isSidebarOpen ? "" : "mx-auto"} />
                            {isSidebarOpen && (
                                <span className="font-medium whitespace-nowrap">{item.label}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / User */}
                <div className="p-4 border-t border-white/5 bg-[#141417]">
                    <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10">
                            <img src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=Admin&background=random`} alt="Admin" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{currentUser?.displayName || "Admin User"}</p>
                                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors ${isSidebarOpen ? '' : 'absolute left-20 opacity-0 pointer-events-none'}`}
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-[#27272a] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 transition-colors shadow-lg z-30"
                >
                    {isSidebarOpen ? <X size={12} /> : <Menu size={12} />}
                </button>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0f0f12] relative">
                {/* Page Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[120px]" />
                </div>

                <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
}
