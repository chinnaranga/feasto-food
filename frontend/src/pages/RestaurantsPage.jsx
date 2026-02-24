import React, { useState, useMemo, useEffect } from "react";
import LiquidBackground from "../components/liquid/LiquidBackground";
import LiquidCard from "../components/liquid/LiquidCard";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Star, Clock, MapPin, Heart,
    Sparkles, Filter, ChevronDown, Store,
    UtensilsCrossed, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import FiaMascot from "../components/FiaMascot";
import toast from "react-hot-toast";
import {
    Input,
    Button,
    Badge,
    EmptyState,
    Card
} from "../components/ui";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

// Fallback images
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

const RestaurantCard = ({ restaurant, index }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const displayImage = restaurant.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

    const toggleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        toast.dismiss(); // Dismiss duplicate toasts
        if (!isFavorite) {
            toast.success(`Added ${restaurant.name} to favorites`, { icon: '❤️' });
        } else {
            toast("Removed from favorites", { icon: '💔' });
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative h-full"
        >
            <LiquidCard
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="!p-0 h-full overflow-hidden border-white/5 bg-[#18181b] hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col"
            >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={displayImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent opacity-90" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        {restaurant.isOpen ? (
                            <Badge variant="success" className="bg-green-500/90 backdrop-blur-md border-0 shadow-lg">
                                Open Now
                            </Badge>
                        ) : (
                            <Badge variant="danger" className="bg-red-500/90 backdrop-blur-md border-0 shadow-lg">
                                Closed
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFavorite}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all z-10
                            ${isFavorite ? 'bg-red-500 text-white border-red-500' : 'bg-black/40 text-white/80 hover:text-red-400'}
                        `}
                    >
                        <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                    </motion.button>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-2 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                            {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 shrink-0">
                            <Star size={14} className="text-green-400 fill-green-400" />
                            <span className="text-sm font-bold text-green-400">{restaurant.rating || 4.5}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-1 mb-4">
                        {restaurant.cuisine || "Italian • Chinese • Continental"}
                    </p>

                    {/* Divider */}
                    <div className="h-px w-full bg-white/5 mb-4" />

                    <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Clock size={16} className="text-orange-400" />
                                {restaurant.deliveryTime || "30-45 min"}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-blue-400" />
                                {restaurant.distance || "2.5 km"}
                            </span>
                        </div>
                        {restaurant.priceRange && (
                            <span className="text-gray-500 font-medium">
                                {restaurant.priceRange}
                            </span>
                        )}
                    </div>
                </div>
            </LiquidCard>
        </motion.div>
    );
};

export default function RestaurantsPage() {
    const { state, dispatch } = useAppContext();
    const globalSearch = state.search || "";
    const navigate = useNavigate();

    // Local search state initialized from global context
    const [search, setSearch] = useState(globalSearch);
    const [sortBy, setSortBy] = useState("rating");
    const [activeFilter, setActiveFilter] = useState("All");
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ["All", "Open Now", "Top Rated", "Fast Delivery"];

    // Fetch Restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "restaurants"));
                const fetchedRestaurants = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Simulating slight delay for skeletal loading effect + Stagger
                setTimeout(() => {
                    setRestaurants(fetchedRestaurants);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Sync global search
    useEffect(() => {
        if (globalSearch !== search) {
            setSearch(globalSearch);
        }
    }, [globalSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        dispatch({ type: "SET_SEARCH", payload: value });
    };

    // Filter Logic
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants];

        // Search Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(r =>
                r.name?.toLowerCase().includes(lowerSearch) ||
                r.cuisine?.toLowerCase().includes(lowerSearch)
            );
        }

        // Category/Status Filter
        if (activeFilter === "Open Now") {
            result = result.filter(r => r.isOpen);
        } else if (activeFilter === "Top Rated") {
            result = result.filter(r => (r.rating || 0) >= 4.5);
        } else if (activeFilter === "Fast Delivery") {
            // Primitive check for demo; needs structured data for real sort
            result = result.filter(r => parseInt(r.deliveryTime) < 30);
        }

        // Sorting
        if (sortBy === "rating") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === "newest") {
            // Assuming simplified sort for now
            result.reverse();
        }

        return result;
    }, [search, sortBy, activeFilter, restaurants]);

    return (
        <LiquidBackground>
            <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-12 px-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
                >
                    <div className="relative">
                        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4 tracking-tight">
                            Discover<br />Great Food
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                            From local favorites to gourmet dining, verify every craving with AeroBite Premium.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-white/10 rounded-full text-sm font-medium text-gray-300 shadow-lg glow-sm">
                            <MapPin size={16} className="text-orange-500" />
                            <span>Hyderabad, India</span>
                            <ChevronDown size={14} className="text-gray-500 ml-1" />
                        </div>
                    </div>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sticky top-24 z-30 bg-[#0f0f12]/80 backdrop-blur-xl py-4 -mx-6 px-6 mb-8 border-y border-white/5 transition-all"
                >
                    <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                            <Input
                                icon={Search}
                                placeholder="Search by restaurant or cuisine..."
                                value={search}
                                onChange={handleSearchChange}
                                className="relative h-12 text-lg bg-[#18181b] border-white/10 focus:border-white/20 shadow-lg"
                            />
                        </div>

                        {/* Filters & Sort */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 p-1 bg-[#18181b] border border-white/10 rounded-xl shadow-lg">
                                {filters.map(filter => (
                                    <motion.button
                                        key={filter}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden ${activeFilter === filter
                                            ? "text-black font-bold shadow-md"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {activeFilter === filter && (
                                            <motion.div
                                                layoutId="activeFilter"
                                                className="absolute inset-0 bg-white rounded-lg"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{filter}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none h-12 pl-4 pr-10 bg-[#18181b] border border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-white/30 cursor-pointer text-gray-300 group-hover:bg-[#1f1f22] transition-colors shadow-lg"
                                >
                                    <option value="rating">Top Rated</option>
                                    <option value="newest">Newest Added</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-80 bg-[#18181b] rounded-2xl animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : filteredRestaurants.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredRestaurants.map((restaurant, index) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12"
                        >
                            <EmptyState
                                icon={Store}
                                title="No restaurants found"
                                description="Try adjusting your filters or search for something else."
                                actionLabel="Clear Filters"
                                onAction={() => {
                                    setSearch("");
                                    setActiveFilter("All");
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <FiaMascot state={loading ? "Finding the best spots..." : "browsing"} />
            </div>
        </LiquidBackground>
    );
}
