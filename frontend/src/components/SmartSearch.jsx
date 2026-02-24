import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, X, TrendingUp, Clock, ChefHat, ArrowRight, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockFoodData } from '../data/mockData';
import toast from 'react-hot-toast';

export default function SmartSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [results, setResults] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle keyboard shortcuts (Cmd+K is handled globally, but ESC here)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Mock Voice Search
    const toggleVoiceSearch = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        setIsListening(true);
        toast('Listening... (Try saying "Spicy Pizza")', { icon: '🎙️' });

        // Simulate voice recognition
        setTimeout(() => {
            setQuery('Spicy Pizza');
            setIsListening(false);
            toast.success('Heard "Spicy Pizza"');
        }, 2000);
    };

    // Search Logic
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const lowerQ = query.toLowerCase();
        const filtered = mockFoodData.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(lowerQ) ||
                item.cuisine.toLowerCase().includes(lowerQ) ||
                item.chef?.toLowerCase().includes(lowerQ);

            if (activeCategory === 'All') return matchesSearch;
            if (activeCategory === 'Chefs') return item.chef?.toLowerCase().includes(lowerQ);
            if (activeCategory === 'Dishes') return item.name.toLowerCase().includes(lowerQ);

            return matchesSearch;
        }).slice(0, 5); // Limit results

        setResults(filtered);
    }, [query, activeCategory]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header / Input Area */}
                    <div className="flex items-center p-4 border-b border-gray-800 gap-3">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                            placeholder="Search dishes, chefs, or cuisines..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleVoiceSearch}
                                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-gray-800 text-gray-400'}`}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs text-gray-500 font-mono">
                                <Command size={10} /> K
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 p-3 bg-gray-900/50 border-b border-gray-800 overflow-x-auto">
                        {['All', 'Dishes', 'Restaurants', 'Chefs'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results Area */}
                    <div className="max-h-[60vh] overflow-y-auto p-2">

                        {/* Empty State / Suggestions */}
                        {!query && (
                            <div className="p-4">
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Trending Searches</h3>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                                    {['Biryani', 'Vegan Pizza', 'Sushi', 'Desserts'].map(term => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <TrendingUp size={14} className="text-orange-400" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Live Results */}
                        <div className="space-y-1">
                            {results.map(item => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    onClick={() => {
                                        // Navigate or open modal (mock action)
                                        toast.success(`Selected: ${item.name}`);
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800 cursor-pointer group transition-colors"
                                >
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors">{item.name}</h4>
                                            <span className="text-orange-400 font-bold">₹{item.price}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {item.prepTime}m</span>
                                            {item.chef && <span className="flex items-center gap-1"><ChefHat size={12} /> {item.chef}</span>}
                                            <span>• {item.cuisine}</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-600 group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                </motion.div>
                            ))}

                            {query && results.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-gray-800/50 border-t border-gray-800 text-xs text-gray-500 flex justify-between">
                        <span>Enter to select</span>
                        <span>Esc to close</span>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
