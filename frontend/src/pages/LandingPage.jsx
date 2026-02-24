import React, { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Zap,
  Gift,
  Award,
  TrendingUp,
  ChefHat,
  Filter,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  MapPin
} from "lucide-react";

import useCart from "../context/CartContext";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { EmptyState } from "../components/ui";
import { RestaurantCard } from "../components/RestaurantCard";
import SEO from "../components/SEO";
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";

/* -------------------- DATA -------------------- */

const restaurantData = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    reviews: 324,
    time: "30-40 min",
    discount: 20,
    price: "$$",
    verified: true,
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    specialties: ["Margherita", "Pepperoni"],
    popular: true,
    trending: false,
    itemPrice: 18.99,
  },
  {
    id: 2,
    name: "Burger Hub",
    cuisine: "American",
    rating: 4.2,
    reviews: 156,
    time: "20-30 min",
    discount: 15,
    price: "$",
    verified: true,
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop",
    specialties: ["Classic Burger", "BBQ Bacon"],
    popular: false,
    trending: true,
    itemPrice: 12.49,
  },
  {
    id: 3,
    name: "Sushi World",
    cuisine: "Japanese",
    rating: 4.8,
    reviews: 289,
    time: "40-50 min",
    price: "$$$",
    verified: true,
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=800&auto=format&fit=crop",
    specialties: ["Dragon Roll", "Salmon Sashimi"],
    popular: true,
    trending: false,
    itemPrice: 24.99,
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your food delivered in under 30 minutes"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your payments and data are always protected"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart recommendations based on your taste"
  }
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "200+", label: "Restaurant Partners" },
  { value: "4.8", label: "Average Rating" }
];

/* -------------------- FILTERS -------------------- */

const categories = [
  { icon: Zap, label: "Fast", id: "fast" },
  { icon: Gift, label: "Offers", id: "offers" },
  { icon: Award, label: "Top Rated", id: "top" },
  { icon: TrendingUp, label: "Trending", id: "trending" },
  { icon: ChefHat, label: "New", id: "new" },
];

/* -------------------- ANIMATIONS -------------------- */

const gridVariants = {
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

/* -------------------- COMPONENT -------------------- */

export default function LandingPage() {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppContext();
  const { search, activeFilter, highlightRestaurantId } = state;
  const navigate = useNavigate();

  const cardRefs = useRef({});

  /* Auto-scroll to AI highlighted restaurant */
  useEffect(() => {
    if (highlightRestaurantId && cardRefs.current[highlightRestaurantId]) {
      cardRefs.current[highlightRestaurantId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const t = setTimeout(() => {
        dispatch({ type: "HIGHLIGHT_RESTAURANT", payload: null });
      }, 1800);

      return () => clearTimeout(t);
    }
  }, [highlightRestaurantId, dispatch]);

  const handleAddToCart = (restaurant) => {
    addToCart(
      {
        id: restaurant.id,
        name: restaurant.name,
        price: restaurant.itemPrice,
        image: restaurant.image,
      },
      1
    );
    toast.success(`${restaurant.name} added to cart`);
  };

  const filteredRestaurants = useMemo(() => {
    return restaurantData.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q);

      let matchesFilter = true;
      if (activeFilter === "fast") matchesFilter = parseInt(r.time) <= 30;
      if (activeFilter === "offers") matchesFilter = r.discount > 0;
      if (activeFilter === "top") matchesFilter = r.rating >= 4.5;
      if (activeFilter === "trending") matchesFilter = r.trending;
      if (activeFilter === "new") matchesFilter = r.isNew;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <LiquidContainer className="pb-20">
      <SEO
        title="Premium Food Delivery"
        description="AeroBite uses AI to find your perfect meal. Order from top restaurants with lightning-fast delivery."
      />

      {/* Premium 2026 SaaS Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-600/10 blur-[120px] animate-pulse-slow delay-1000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-glow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-300 tracking-wide font-display">
                  Premium Food Delivery 2026
                </span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] font-display">
                Taste the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">
                  Future.
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg font-light font-sans">
                Experience the next generation of food delivery. Predictive AI, realtime tracking, and a premium culinary network at your fingertips.
              </p>

              <div className="flex flex-wrap gap-5">
                <LiquidButton
                  variant="primary"
                  className="px-8 py-4 text-lg rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-500/25 border-0 text-white font-medium"
                  onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
                >
                  <span className="flex items-center gap-2">
                    Start Ordering <ArrowRight size={20} />
                  </span>
                </LiquidButton>

                <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-white/5">
                  <button
                    onClick={() => navigate("/restaurants")}
                    className="px-8 py-4 text-lg rounded-2xl bg-[#0B0F14]/80 backdrop-blur-md text-white hover:bg-white/10 transition-all flex items-center gap-2 h-full border border-white/10"
                  >
                    View Restaurants
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8 pt-8 border-t border-white/5">
                {[
                  { value: "50K+", label: "Active Users" },
                  { value: "15min", label: "Avg Delivery" },
                  { value: "4.9/5", label: "App Store" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative perspective-1000"
            >
              {/* Main Glass Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]/60 backdrop-blur-xl"
              >
                {/* Mockup Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="mx-auto w-1/3 h-2 rounded-full bg-white/10" />
                </div>

                {/* Mockup Content */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop"
                    alt="App Interface"
                    className="w-full h-auto opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                  {/* Floating Analytics Card 1 */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-8 right-8 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl w-48"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <TrendingUp size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Trending</div>
                        <div className="text-sm font-bold text-white">+24% Orders</div>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[70%]" />
                    </div>
                  </motion.div>

                  {/* Floating Analytics Card 2 */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-1/3 left-8 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-green-500 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" alt="Rider" />
                      </div>
                      <div>
                        <div className="text-xs text-green-400 font-bold">Rider Nearby</div>
                        <div className="text-sm text-white">Arriving in 2m</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 to-red-600/30 blur-[80px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <LiquidCard className="p-8 h-full flex flex-col items-start gap-4 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                    <feature.icon className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white font-display">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed font-sans">{feature.description}</p>
                  </div>
                </LiquidCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* FILTER BAR */}
        <div className="mb-10 flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          <div className="p-3 rounded-full bg-white/5 border border-white/10 flex-shrink-0 backdrop-blur-md">
            <Filter size={18} className="text-gray-400" />
          </div>

          {categories.map((cat) => {
            const active = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  dispatch({
                    type: "SET_FILTER",
                    payload: active ? "All" : cat.id,
                  })
                }
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all border backdrop-blur-md font-medium font-sans ${active
                  ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
                  }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* SECTION HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">
            {search ? `Results for "${search}"` : "Recommended for you"}
          </h2>
          <p className="mt-2 text-gray-400 max-w-xl font-sans">
            {search
              ? "Personalized results based on your intent"
              : "Picked using ratings, popularity, and delivery speed"}
          </p>
        </div>

        {/* GRID */}
        {filteredRestaurants.length > 0 ? (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRestaurants.map((r) => (
              <motion.div
                key={r.id}
                variants={itemVariants}
                ref={(el) => (cardRefs.current[r.id] = el)}
                className={`h-full transition ${r.id === highlightRestaurantId
                  ? "ring-2 ring-orange-500/60 rounded-3xl shadow-[0_0_60px_-10px_rgba(255,107,0,0.35)]"
                  : ""
                  }`}
              >
                <RestaurantCard
                  restaurant={r}
                  highlight={r.id === highlightRestaurantId}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={() => toast.success("Added to favorites")}
                  isFavorite={false}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No restaurants found"
            description="Try adjusting your filters or search term"
            action={
              <LiquidButton
                variant="secondary"
                onClick={() => {
                  dispatch({ type: "SET_SEARCH", payload: "" });
                  dispatch({ type: "SET_FILTER", payload: "All" });
                }}
              >
                Clear Filters
              </LiquidButton>
            }
          />
        )}
      </main>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to experience the future of food delivery?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of happy customers who trust AeroBite for their daily meals
            </p>
            <LiquidButton
              variant="primary"
              className="px-8 py-4 text-lg inline-flex"
              onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
            >
              {currentUser ? "Start Ordering" : "Sign Up Now"}
              <ArrowRight className="ml-2" />
            </LiquidButton>
          </motion.div>
        </div>
      </section>

      <div className="pb-28" /> {/* Spacer for bottom navigation */}
    </LiquidContainer>
  );
}