import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    ArrowLeft, Star, Clock, MapPin,
    Share2, Search, Plus, Flame, Sparkles, Heart, MessageSquare
} from "lucide-react";
import useCart from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import FiaMascot from "../components/FiaMascot";
import { EmptyState } from "../components/ui";
import SEO from "../components/SEO";

// Mock Bestsellers for visual richness if data is sparse
const MOCK_BESTSELLERS = [
    { id: 'bs1', name: 'Signature Truffle Pasta', price: 450, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400', rating: 4.8 },
    { id: 'bs2', name: 'Spicy Dragon Chicken', price: 320, image: 'https://images.unsplash.com/photo-1525755617299-7206566495bc?w=400', rating: 4.7 },
];

export default function RestaurantDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser, userData, login } = useAuth(); // Need userData for favorites

    // Scroll handling
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 300], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    // Review Form State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // 1. Fetch Restaurant Info & Menu (Public API)
                const resResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/restaurant/${id}`);
                if (!resResponse.ok) throw new Error("Restaurant not found");
                const resData = await resResponse.json();

                setRestaurant(resData);
                setMenu(resData.menu || []);

                // 2. Fetch Reviews
                const reviewsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews/${id}`);
                if (reviewsResponse.ok) {
                    const reviewsData = await reviewsResponse.json();
                    setReviews(reviewsData);
                }

                // 3. Check Favorites (if logged in)
                if (currentUser && userData?.favorites) {
                    // Start checking
                    checkFavoriteStatus();
                }

            } catch (error) {
                console.error("Error fetching details:", error);
                toast.error("Failed to load restaurant details");
                // navigate("/restaurants"); // Don't redirect immediately to allow debugging
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, currentUser, userData]); // Re-run if user logs in

    // Separate check to ensure it runs when userData loads
    useEffect(() => {
        if (userData?.favorites) {
            checkFavoriteStatus();
        }
    }, [userData, id]);

    const checkFavoriteStatus = async () => {
        try {
            const token = await currentUser?.getIdToken();
            if (!token) return;

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/user/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const favs = await response.json();
                // Check if current ID is in favorites
                const isFav = favs.some(f => f._id === id || f === id);
                setIsFavorite(isFav);
            }
        } catch (e) { console.error("Fav check failed", e); }
    };

    const handleToggleFavorite = async () => {
        if (!currentUser) {
            toast.error("Please login to save favorites");
            return;
        }
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/user/favorites/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setIsFavorite(data.isFavorite);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error("Failed to update favorites");
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) return toast.error("Please login to review");

        setSubmittingReview(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    restaurantId: id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to submit review");
            }

            const savedReview = await response.json();
            setReviews([savedReview, ...reviews]);
            setNewReview({ rating: 5, comment: "" });
            setShowReviewForm(false);
            toast.success("Review submitted!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    // Derived State
    const categories = ["All", "Bestsellers", ...new Set(menu.map(item => item.category))].filter(Boolean);

    const filteredMenu = menu.filter(item => {
        const matchesCategory = activeCategory === "All" || activeCategory === "Bestsellers" || item.category === activeCategory;
        const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // For Bestsellers, we mock/assume isPopular or just show all if none
        if (activeCategory === "Bestsellers") return (item.isPopular || item.bestseller) && matchesSearch;

        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (item) => {
        addToCart({
            id: item._id, // MongoDB uses _id
            name: item.name,
            price: item.price,
            image: item.image,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name
        });
        toast.success(
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <span>Added <b>{item.name}</b></span>
            </div>
        );
    };

    const scrollToCategory = (cat) => {
        setActiveCategory(cat);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium animate-pulse tracking-wide">
                        PREPARING EXPERIENCE...
                    </p>
                </div>
            </div>
        );
    }

    if (!restaurant) return null;

    return (
        <div className="min-h-screen bg-[#0f0f12] text-white pb-20 overflow-x-hidden">

            {/* 📸 Hero Banner with Parallax */}
            <div className="relative h-[400px] overflow-hidden">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-[#0f0f12]/40 to-black/30" />
                </motion.div>

                {restaurant && (
                    <SEO
                        title={`${restaurant.name} - Order Online`}
                        description={`Order ${restaurant.cuisine} from ${restaurant.name}. Rated ${restaurant.rating}/5.`}
                        image={restaurant.image}
                    />
                )}

                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/restaurants")}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-6 right-6 z-20 flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleFavorite}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                    >
                        <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10"
                    >
                        <Share2 size={18} />
                    </motion.button>
                </div>
            </div>

            {/* ℹ️ Restaurant Info Card (Floating) */}
            <div className="relative z-10 -mt-24 px-4 md:px-8 max-w-7xl mx-auto mb-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#18181b]/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight"
                            >
                                {restaurant.name}
                            </motion.h1>
                            <p className="text-gray-400 text-lg mb-4 flex items-center gap-2">
                                <UtensilsIcon />
                                {restaurant.cuisine || "Multi-Cuisine • Modern • Gourmet"}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                    <Star size={14} className="fill-green-400" />
                                    <span className="font-bold">{restaurant.rating || "New"}</span>
                                    <span className="opacity-60 text-xs ml-1">({restaurant.reviews || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <Clock size={14} className="text-orange-400" />
                                    <span>{restaurant.time || "30-40 min"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <MapPin size={14} className="text-blue-400" />
                                    <span>{restaurant.address || "Bangalore"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Offers / Action */}
                        <div className="hidden md:block">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 max-w-xs cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Flame size={18} className="text-orange-500 fill-orange-500" />
                                    <p className="text-orange-400 font-bold text-sm">FLAT 20% OFF</p>
                                </div>
                                <p className="text-gray-400 text-xs">Use code <span className="text-white font-mono bg-white/10 px-1 rounded">TASTY20</span></p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* 🔍 Category & Search Bar */}
                <div className="sticky top-20 z-30 bg-[#0f0f12]/80 backdrop-blur-xl py-4 border-y border-white/5 mb-8 -mx-4 md:-mx-8 px-4 md:px-8 mt-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                            <div className="flex items-center gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => scrollToCategory(cat)}
                                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all relative overflow-hidden ${activeCategory === cat
                                            ? "text-black shadow-lg shadow-white/10"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <span className="relative z-10">{cat}</span>
                                        {activeCategory === cat && (
                                            <motion.div
                                                layoutId="activeCat"
                                                className="absolute inset-0 bg-white rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full md:w-72 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-[#18181b] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* 📋 Menu Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                        <AnimatePresence mode="popLayout">
                            {filteredMenu.length > 0 ? (
                                filteredMenu.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={item._id || item.id}
                                        className="group flex gap-4 p-4 rounded-2xl bg-[#18181b] border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        {/* Item Image */}
                                        <div className="w-32 h-32 flex-shrink-0 relative rounded-xl overflow-hidden bg-white/5">
                                            <img
                                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-bold text-sm tracking-wide bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                                                    Quick Add
                                                </span>
                                            </div>
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                                            <div>
                                                <div className="flex justify-between items-start mb-1 gap-2">
                                                    <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    {item.isVeg ? (
                                                        <div className="flex-shrink-0 w-4 h-4 border border-green-500 flex items-center justify-center p-0.5 rounded-sm" title="Veg">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-shrink-0 w-4 h-4 border border-red-500 flex items-center justify-center p-0.5 rounded-sm" title="Non-Veg">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                                    {item.description || "A delicious preparation made with fresh ingredients and authentic spices."}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <span className="font-bold text-white text-lg">₹{item.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(item);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-1 lg:col-span-2 py-12">
                                    <EmptyState
                                        icon={Search}
                                        title="No items found"
                                        description="Try changing the category or search term."
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ⭐ Reviews Section */}
                    <div className="mt-12 border-t border-white/10 pt-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <MessageSquare className="text-orange-500" />
                                    Reviews
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">What others are saying</p>
                            </div>
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors border border-white/10"
                            >
                                Write a Review
                            </button>
                        </div>

                        {/* Review Form */}
                        <AnimatePresence>
                            {showReviewForm && (
                                <motion.form
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    onSubmit={handleSubmitReview}
                                    className="bg-[#18181b] p-6 rounded-2xl border border-white/10 mb-8 overflow-hidden"
                                >
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${newReview.rating >= star
                                                            ? "bg-orange-500/20 border-orange-500 text-orange-500"
                                                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                        }`}
                                                >
                                                    <Star size={20} className={newReview.rating >= star ? "fill-current" : ""} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-400 mb-2">Comment</label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500/50 min-h-[100px]"
                                            placeholder="Share your experience..."
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowReviewForm(false)}
                                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                        >
                                            {submittingReview ? "Posting..." : "Post Review"}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.length > 0 ? (
                                reviews.map((review, idx) => (
                                    <div key={review._id || idx} className="bg-[#18181b] p-5 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                                                    {review.userAvatar ? (
                                                        <img src={review.userAvatar} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        review.userName?.[0]?.toUpperCase() || "U"
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{review.userName || "User"}</h4>
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                                <Star size={12} className="text-orange-500 fill-orange-500" />
                                                <span className="font-bold text-sm">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 md:col-span-2 text-center py-10 bg-[#18181b]/50 rounded-2xl border border-white/5 border-dashed">
                                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fia */}
            <FiaMascot state="browsing" />
        </div>
    );
}

// Icon for cuisine
const UtensilsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);
