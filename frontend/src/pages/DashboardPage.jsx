import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search, Star, Clock, TrendingUp, Heart, Sparkles, ShoppingBag, Zap,
  ChefHat, Filter, Flame, Award, MapPin, User, LogOut, Coffee,
  UtensilsCrossed, Pizza, Cookie, Home, Package, Settings, Bell
} from "lucide-react";

import useCart from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { mockFoodData } from "../data/mockData";
import { Button, Card, CardBody, EmptyState, Badge, SkeletonCard } from "../components/ui";
import FoodModal from "../components/FoodModal";
import SurpriseModal from "../components/SurpriseModal";
import FoodItemCard from "../components/FoodItemCard";
import PageLoader from "../components/PageLoader";
import AIChatOrder from "../components/AIChatOrder";
import { rankFoods } from "../ai/aiRanker";
import { getSurprisePick } from "../ai/aiSurprise";
import { parseQuery } from "../ai/nlpSearch";
import FlyingCart from "../components/ui/FlyingCart";
import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidCard from "../components/liquid/LiquidCard";

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color = "green" }) => (
  <LiquidCard
    hoverEffect={true}
    className="p-6 transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      {trend && (
        <Badge variant="success" className="text-xs">
          +{trend}%
        </Badge>
      )}
    </div>
    <p className="text-2xl font-bold mb-1 text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </LiquidCard>
);

// Featured Food Card
const FeaturedCard = ({ food, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="relative overflow-hidden rounded-3xl cursor-pointer group h-[280px]"
  >
    <img
      src={food.image}
      alt={food.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    <div className="absolute bottom-0 left-0 right-0 p-6">
      <Badge className="mb-3">⭐ Featured</Badge>
      <h3 className="text-2xl font-bold mb-2">{food.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {food.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {food.time || "30 min"}
          </span>
        </div>
        <p className="text-2xl font-bold text-green-400">${food.price}</p>
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedFood, setSelectedFood] = useState(null);
  const [surpriseFood, setSurpriseFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reorderItems, setReorderItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const cart = useCart();
  const addToCart = cart?.addToCart;

  // Animation Refs
  const cartBtnRef = React.useRef(null);
  const flyingCartRef = React.useRef(null);

  const handleAddToCart = (food, quantity, e) => {
    addToCart(food, quantity);
    if (e?.target) {
      const rect = e.target.getBoundingClientRect();
      flyingCartRef.current?.trigger(food.image, rect);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) navigate("/login");

    // Fetch personalization data
    const fetchPersonalization = async () => {
      try {
        const token = await currentUser.getIdToken();

        // Fetch reorder items
        const reorderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/reorder`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (reorderRes.ok) {
          const data = await reorderRes.json();
          setReorderItems(data.items || []);
        }

        // Fetch recommendations
        const recommendedRes = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/suggested`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recommendedRes.ok) {
          const data = await recommendedRes.json();
          setRecommendedItems(data.items || []);
        }
      } catch (error) {
        console.error('Error fetching personalization data:', error);
      }
    };

    if (currentUser) {
      fetchPersonalization();
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSurpriseMe = () => {
    const pick = getSurprisePick(mockFoodData);
    setSurpriseFood(pick);
  };

  const categories = [
    { id: "All", icon: UtensilsCrossed, label: "All" },
    { id: "Pizza", icon: Pizza, label: "Pizza" },
    { id: "Dessert", icon: Cookie, label: "Desserts" },
    { id: "Coffee", icon: Coffee, label: "Drinks" },
    { id: "Trending", icon: TrendingUp, label: "Trending" },
    { id: "Favorites", icon: Heart, label: "Favorites" }
  ];

  const navItems = [
    {
      icon: Home,
      label: "Browse",
      active: activeTab !== "Favorites",
      onClick: () => setActiveTab("All")
    },
    {
      icon: Package,
      label: "Orders",
      onClick: () => navigate("/orders")
    },
    {
      icon: Heart,
      label: "Favorites",
      active: activeTab === "Favorites",
      onClick: () => setActiveTab("Favorites")
    },
    {
      icon: User,
      label: "Profile",
      onClick: () => navigate("/profile")
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => navigate("/profile")
    }
  ];

  const visibleFood = useMemo(() => {
    let data = [...mockFoodData];
    const parsed = parseQuery(search);

    if (parsed.spicy) data = data.filter(f => f.tags?.includes("spicy") || f.isSpicy);
    if (parsed.cheap) data = data.filter(f => f.price <= Number(parsed.cheap));
    if (parsed.healthy) data = data.filter(f => f.tags?.includes("healthy") || (f.nutrition && parseInt(f.nutrition.calories) < 500));

    if (search.trim() && !parsed.spicy && !parsed.cheap && !parsed.healthy) {
      data = data.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    }

    data = rankFoods(data);

    if (activeTab === "Trending") data = data.filter(f => f.isPopular);
    if (activeTab === "Favorites") data = data.filter(f => f.rating >= 4.5);
    if (activeTab !== "All" && activeTab !== "Trending" && activeTab !== "Favorites") {
      data = data.filter(f => f.category === activeTab || f.name.toLowerCase().includes(activeTab.toLowerCase()));
    }

    return data;
  }, [activeTab, search]);

  if (!currentUser) return <PageLoader />;

  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const featuredFood = mockFoodData.find(f => f.rating >= 4.5) || mockFoodData[0];

  return (
    <LiquidBackground>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed left-0 top-0 h-screen w-72 bg-[#0B0F14]/90 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-xl font-bold font-display text-white">F</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-white font-display">Feasto</h2>
                <p className="text-xs text-gray-400">Premium Delivery</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center p-[2px]">
                <div className="w-full h-full rounded-full bg-[#121821] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white truncate font-display">{currentUser?.displayName || "Guest User"}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
            </div>

            {/* Stats Mini */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-xl font-bold text-orange-400">12</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-xl font-bold text-yellow-400">4.9</p>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            {navItems.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${item.active
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_15px_-5px_rgba(255,107,0,0.3)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dishes, cuisines, restaurants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#121821] border border-white/10 rounded-full pl-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 ml-6">
                <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  ref={cartBtnRef}
                  onClick={() => navigate("/cart")}
                  className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                  {cart?.items?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                      {cart.items.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-8 space-y-8">
            {/* Immersive Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-900/40 to-[#121821] border border-white/10 p-8 md:p-12 text-white mb-8 shadow-2xl">
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium"
                  >
                    <Sparkles size={12} className="text-orange-400" />
                    <span className="text-orange-100">AI-Powered Recommendations</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black tracking-tight font-display"
                  >
                    {greeting}, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                      {currentUser?.displayName?.split(' ')[0] || 'Foodie'}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-400"
                  >
                    It's lunch time! 🍔 We've curated some fast & fresh options for you.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4 pt-2"
                  >
                    <Button size="lg" className="rounded-full shadow-lg shadow-orange-500/20 bg-orange-600 hover:bg-orange-500 text-white border-none">
                      Order Now
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full border-white/10 hover:bg-white/5 text-white">
                      View Offers
                    </Button>
                  </motion.div>
                </div>

                {/* Hero Floating Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="hidden md:block relative"
                >
                  <motion.img
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    src="https://cdn-icons-png.flaticon.com/512/706/706164.png" // Placeholder high-res food
                    alt="Delicious Food"
                    className="w-64 h-64 drop-shadow-2xl"
                  />
                  {/* Floating badges */}
                  <motion.div
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-4 -right-4 bg-[#161D27] text-orange-400 border border-orange-500/20 p-3 rounded-2xl shadow-xl font-bold text-sm"
                  >
                    🔥 Hot Deal
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard icon={Package} label="Total Orders" value="127" trend="12" color="orange" />
              <StatsCard icon={Heart} label="Favorites" value="45" trend="8" color="red" />
              <StatsCard icon={Award} label="Points" value="2,450" trend="15" color="yellow" />
              <StatsCard icon={Clock} label="Avg. Delivery" value="28 min" color="blue" />
            </div>

            {/* Featured Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white font-display">Featured Today</h2>
                <Button variant="ghost" size="sm" className="text-orange-400 hover:text-orange-300">View All</Button>
              </div>
              <FeaturedCard food={featuredFood} onClick={() => setSelectedFood(featuredFood)} />
            </div>

            {/* AI Chat */}
            <AIChatOrder />

            {/* Animated Category Rail */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-display">Explore Categories</h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
                {categories.map((cat, idx) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(cat.id)}
                    className={`
                    snap-start flex-shrink-0 relative overflow-hidden w-28 h-32 rounded-3xl p-4 flex flex-col items-center justify-center gap-3 transition-all border
                    ${activeTab === cat.id
                        ? 'bg-gradient-to-b from-orange-500 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-[#18181b] border-white/5 text-gray-400 hover:border-white/20 hover:bg-[#202025]'
                      }
                  `}
                  >
                    <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner
                    ${activeTab === cat.id ? 'bg-white/20' : 'bg-black/20'}
                  `}>
                      <cat.icon size={24} />
                    </div>
                    <span className="font-semibold text-sm tracking-wide">{cat.label}</span>

                    {/* Active Indicator Dot */}
                    {activeTab === cat.id && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute bottom-2 w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Reorder Again Section */}
            {reorderItems.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    Reorder Again
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                  {reorderItems.map((food) => (
                    <motion.div
                      key={food.id}
                      whileHover={{ y: -4 }}
                      className="flex-shrink-0 w-64 bg-[#18181b] border border-white/10 rounded-2xl p-4 hover:border-orange-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedFood(food)}
                    >
                      <img src={food.image} alt={food.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                      <h3 className="font-bold text-white mb-1 truncate">{food.name}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ordered {food.orderCount}x</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(food, 1, e);
                          }}
                          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Add ${food.price}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommended for You Section */}
            {recommendedItems.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Recommended for You
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recommendedItems.slice(0, 8).map((food) => (
                    <FoodItemCard
                      key={food.id}
                      food={food}
                      onAddToCart={handleAddToCart}
                      onViewDetails={setSelectedFood}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSurpriseMe}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-left"
              >
                <Zap className="w-8 h-8 mb-3" />
                <p className="font-bold mb-1">Surprise Me</p>
                <p className="text-xs opacity-80">Random pick</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearch("fast")}
                className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-left"
              >
                <Flame className="w-8 h-8 mb-3" />
                <p className="font-bold mb-1">Fast Delivery</p>
                <p className="text-xs opacity-80">Under 30 min</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearch("healthy")}
                className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-left"
              >
                <Heart className="w-8 h-8 mb-3" />
                <p className="font-bold mb-1">Healthy</p>
                <p className="text-xs opacity-80">Low calorie</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearch("chef")}
                className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 text-left"
              >
                <ChefHat className="w-8 h-8 mb-3" />
                <p className="font-bold mb-1">Top Chefs</p>
                <p className="text-xs opacity-80">Premium dishes</p>
              </motion.button>
            </div>

            {/* Food Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {search ? `Results for "${search}"` : activeTab}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {visibleFood.length} {visibleFood.length === 1 ? 'dish' : 'dishes'} available
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : visibleFood.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
                  <AnimatePresence mode="popLayout">
                    {visibleFood.map((food, index) => {
                      // Feature the first item only in "All" view with no search
                      const isFeatured = index === 0 && !search && activeTab === 'All';

                      return (
                        <motion.div
                          key={food.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className={isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1"}
                        >
                          <FoodItemCard
                            food={food}
                            featured={isFeatured}
                            onClick={() => setSelectedFood(food)}
                            onAddToCart={handleAddToCart}
                          />
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No dishes found"
                  description="Try adjusting your search or browse our categories"
                  action={
                    <Button variant="outline" onClick={() => { setSearch(""); setActiveTab("All"); }}>
                      View All Dishes
                    </Button>
                  }
                />
              )}
            </div>
          </main>
        </div>

        <FlyingCart ref={flyingCartRef} targetRef={cartBtnRef} />

        {/* Modals */}
        <FoodModal food={selectedFood} isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} />
        <SurpriseModal
          isOpen={!!surpriseFood}
          onClose={() => setSurpriseFood(null)}
          food={surpriseFood}
          onAddToCart={(food) => {
            addToCart(food, 1);
            toast.success(`Surprise! Added ${food.name} to cart 🎁`);
          }}
        />
      </div >
    </LiquidBackground>
  );
}