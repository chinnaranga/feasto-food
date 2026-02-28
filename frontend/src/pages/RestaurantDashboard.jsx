import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useAutoLogout from "../hooks/useAutoLogout";
import AutoLogoutModal from "../components/AutoLogoutModal";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    TrendingUp,
    MessageSquare,
    Wallet,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    CheckCircle,
    ShieldAlert,
    Power,
    ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import LiquidBackground from "../components/liquid/LiquidBackground";
import { useNavigate } from "react-router-dom";

// Placeholder imports for module components (we will create these next)
import OverviewTab from "../components/restaurant/OverviewTab";
import OrdersTab from "../components/restaurant/OrdersTab";
import MenuManager from "../components/restaurant/MenuManager";
import AnalyticsTab from "../components/restaurant/AnalyticsTab";
import ReviewsTab from "../components/restaurant/ReviewsTab";
import PayoutsTab from "../components/restaurant/PayoutsTab";
import SettingsTab from "../components/restaurant/SettingsTab";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "menu", label: "Menu Management", icon: UtensilsCrossed },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "payouts", label: "Payouts", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings }
];

export default function RestaurantDashboard() {
    const { currentUser, logout, userData } = useAuth();
    const navigate = useNavigate();
    const { showModal, countdown, resetTimers, COUNTDOWN_SECONDS, timeLeft } = useAutoLogout("restaurant");

    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Responsive Sidebar Auto-collapse on init
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize(); // Init Check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!currentUser) return;
            try {
                const token = await currentUser.getIdToken(true);
                const res = await fetch(`${API_URL}/api/restaurant/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.status === 401) {
                    toast.error("Session invalid. Please login again.");
                    navigate("/restaurant/login");
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setRestaurant(data);
                    setIsOpen(data.isOpen);
                }
            } catch (err) {
                console.error("Failed to fetch restaurant", err);
                toast.error("Connection error. Using offline mode.");
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [currentUser, navigate]);

    const toggleStatus = async () => {
        try {
            const token = await currentUser.getIdToken();
            const newStatus = !isOpen;

            const res = await fetch(`${API_URL}/api/restaurant/toggle`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isOpen: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");

            setIsOpen(newStatus);
            toast.success(newStatus ? "Restaurant is now OPEN 🟢" : "Restaurant is now CLOSED 🔴");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/restaurant/login");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    if (loading) {
        return (
            <LiquidBackground className="flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400 font-medium tracking-widest text-sm animate-pulse">LOADING WORKSPACE...</p>
                </div>
            </LiquidBackground>
        );
    }

    return (
        <LiquidBackground className="text-white">
            <div className="flex h-screen w-full overflow-hidden">
                {showModal && <AutoLogoutModal countdown={countdown} onStay={resetTimers} totalTime={COUNTDOWN_SECONDS} />}

                {/* 🖥️ Collapsible Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 260 : 80,
                        x: window.innerWidth < 1024 && !isSidebarOpen ? -100 : 0
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className={`fixed lg:relative z-50 h-full bg-[#18181b]/95 backdrop-blur-2xl border-r border-white/5 shadow-2xl flex flex-col`}
                >
                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
                        <AnimatePresence mode="popLayout">
                            {isSidebarOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <UtensilsCrossed size={16} className="text-white" />
                                    </div>
                                    <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                        Feasto<span className="text-orange-500">HQ</span>
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mx-auto"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <span className="font-bold text-lg text-white">F</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden
                                    ${isActive ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                    title={!isSidebarOpen ? item.label : ""}
                                >
                                    {/* Active Background Layer */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebarActive"
                                            className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/5 border border-orange-500/30 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <Icon size={20} className={`shrink-0 z-10 transition-colors ${isActive ? 'text-orange-400' : 'group-hover:text-orange-300'}`} />

                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="font-medium text-sm whitespace-nowrap z-10"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active Indicator Dot */}
                                    {isActive && isSidebarOpen && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,1)] z-10"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Logout Area */}
                    <div className="p-4 border-t border-white/5 shrink-0">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors
                            ${!isSidebarOpen && 'justify-center'}
                        `}
                            title="Logout"
                        >
                            <LogOut size={20} className="shrink-0" />
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, w: 0 }}
                                        animate={{ opacity: 1, w: "auto" }}
                                        exit={{ opacity: 0, w: 0 }}
                                        className="font-medium text-sm"
                                    >
                                        Log Out
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                    {/* 🔝 Top Navbar */}
                    <header className="h-20 bg-[#0f0f12]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40 sticky top-0">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Menu size={24} />
                            </button>

                            <div className="hidden sm:block">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                                    {restaurant?.name || "Dashboard"}
                                </h2>
                                <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                    {NAV_ITEMS.find(n => n.id === activeTab)?.label} Overview <ChevronRight size={10} className="mt-0.5" />
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-6">
                            {/* Auto Logout Warning Top Badge */}
                            {timeLeft <= COUNTDOWN_SECONDS && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-500 animate-pulse">
                                    Session ending in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                </div>
                            )}

                            {/* Status Toggle (Open/Close) */}
                            <div className="flex items-center gap-3 bg-[#18181b] p-1.5 rounded-full border border-white/5 shadow-inner">
                                <span className="text-xs font-bold text-gray-400 pl-3 hidden sm:block">Status</span>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {isOpen ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
                                    <span className="hidden sm:block">{isOpen ? "ONLINE" : "OFFLINE"}</span>
                                </div>
                                <button
                                    onClick={toggleStatus}
                                    className={`p-2 rounded-full transition-colors shadow-lg ${isOpen ? 'bg-white/10 hover:bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-green-500/20 text-green-400'}`}
                                    title="Toggle Status"
                                >
                                    <Power size={16} />
                                </button>
                            </div>

                            <div className="w-px h-6 bg-white/10" />

                            {/* Notifications */}
                            <button className="relative text-gray-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#0f0f12]"></span>
                            </button>

                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border-2 border-white/10 overflow-hidden shadow-lg cursor-pointer">
                                <img src={restaurant?.image || "https://ui-avatars.com/api/?name=Restaurant&background=random"} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </header>

                    {/* 📄 Dynamic Tab Content Injection */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 no-scrollbar scroll-smooth">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-7xl mx-auto h-full"
                            >
                                {/* Render Tab Component based on active tab state */}
                                {activeTab === "overview" && <OverviewTab restaurantId={restaurant?.id} />}
                                {activeTab === "orders" && <OrdersTab restaurantId={restaurant?.id} />}
                                {activeTab === "menu" && <MenuManager restaurantId={restaurant?.id} />}
                                {activeTab === "analytics" && <AnalyticsTab restaurantId={restaurant?.id} />}
                                {activeTab === "reviews" && <ReviewsTab restaurantId={restaurant?.id} />}
                                {activeTab === "payouts" && <PayoutsTab restaurantId={restaurant?.id} />}
                                {activeTab === "settings" && <SettingsTab restaurantId={restaurant?.id} initialData={restaurant} />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {isSidebarOpen && window.innerWidth < 1024 && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </LiquidBackground>
    );
}
