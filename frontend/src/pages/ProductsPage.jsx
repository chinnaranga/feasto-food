import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Star,
    Clock,
    ShoppingCart,
    Heart,
    Sparkles,
    Flame,
    Leaf,
    ChefHat,
} from "lucide-react";
import useCart from "../context/CartContext";
import { mockFoodData } from "../data/mockData";
import toast from "react-hot-toast";

const categories = [
    { id: "all", name: "All", icon: Sparkles },
    { id: "popular", name: "Popular", icon: Flame },
    { id: "healthy", name: "Healthy", icon: Leaf },
    { id: "chef", name: "Chef's Special", icon: ChefHat },
];

const ProductCard = ({ product, onAddToCart }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group relative bg-[#18181b] rounded-2xl border border-white/5 overflow-hidden hover:border-orange-500/30 transition-all"
    >
        <div className="relative h-48 overflow-hidden">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
                {product.isPopular && (
                    <span className="bg-orange-500/90 backdrop-blur text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                        <Flame size={12} /> Popular
                    </span>
                )}
            </div>

            {/* Favorite Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
            >
                <Heart size={16} />
            </motion.button>

            {/* Rating */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-1 rounded-lg">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{product.rating}</span>
            </div>
        </div>

        <div className="p-5">
            <h3 className="font-bold text-white text-lg group-hover:text-orange-400 transition-colors">
                {product.name}
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.desc}</p>

            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Clock size={12} />
                <span>20-30 min</span>
                <span>•</span>
                <span>{product.cuisine}</span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    ₹{product.price}
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddToCart(product)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                    <ShoppingCart size={14} />
                    Add
                </motion.button>
            </div>
        </div>
    </motion.div>
);

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const { addToCart } = useCart();

    const filteredProducts = useMemo(() => {
        let products = [...mockFoodData];

        if (activeCategory === "popular") {
            products = products.filter((p) => p.isPopular);
        } else if (activeCategory === "healthy") {
            products = products.filter((p) => p.nutrition?.calories && parseInt(p.nutrition.calories) < 400);
        } else if (activeCategory === "chef") {
            products = products.filter((p) => p.rating >= 4.5);
        }

        if (search) {
            products = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.cuisine.toLowerCase().includes(search.toLowerCase())
            );
        }

        return products;
    }, [activeCategory, search]);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        toast.success(`Added ${product.name} to cart!`);
    };

    return (
        <div className="relative min-h-screen bg-[#0f0f12] text-white pt-24 pb-12 px-6">
            {/* Background Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold mb-2">Explore Products</h1>
                    <p className="text-gray-400">
                        Browse dishes, combos, and curated meals from top restaurants.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-4 mb-10"
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search dishes, cuisines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                    ? "bg-orange-500 text-white"
                                    : "bg-[#18181b] text-gray-400 hover:text-white border border-white/10"
                                    }`}
                            >
                                <cat.icon size={14} />
                                {cat.name}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Products Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-lg">No products found</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Try searching for something else or explore different categories
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
