import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { auth } from "../../config/firebase";
import LiquidButton from "../liquid/LiquidButton";
import LiquidInput from "../liquid/LiquidInput";
import LiquidCard from "../liquid/LiquidCard";

export default function MenuManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        description: "",
        category: "Main Course",
        image: "",
        isVeg: false
    });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/restaurant/menu`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch menu");
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load menu items");
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/restaurant/menu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) throw new Error("Failed to add item");

            const addedItem = await response.json();
            setItems([addedItem, ...items]);
            setShowAddForm(false);
            setNewItem({ name: "", price: "", description: "", category: "Main Course", image: "", isVeg: false });
            toast.success("Menu item added successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add item");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/restaurant/menu/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete item");

            setItems(items.filter(item => item.id !== id));
            toast.success("Item deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Menu Management</h2>
                <LiquidButton
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="primary"
                    className="!px-4 !py-2 !text-sm"
                >
                    {showAddForm ? "Cancel" : <><Plus size={18} /> Add New Item</>}
                </LiquidButton>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <LiquidCard className="mb-6 border-orange-500/20">
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <LiquidInput
                                        label="Item Name"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        placeholder="e.g. Butter Chicken"
                                        required
                                    />
                                    <LiquidInput
                                        label="Price (₹)"
                                        type="number"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        placeholder="e.g. 299"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 ml-1 mb-1.5">Category</label>
                                        <div className="relative group">
                                            <select
                                                value={newItem.category}
                                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                                            >
                                                <option className="bg-gray-900">Main Course</option>
                                                <option className="bg-gray-900">Starters</option>
                                                <option className="bg-gray-900">Desserts</option>
                                                <option className="bg-gray-900">Beverages</option>
                                            </select>
                                            {/* Custom arrow could go here */}
                                        </div>
                                    </div>
                                    <LiquidInput
                                        label="Image URL"
                                        type="url"
                                        value={newItem.image}
                                        onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 ml-1 mb-1.5">Description</label>
                                    <textarea
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 focus:border-green-500/50 rounded-2xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-300 backdrop-blur-sm min-h-[100px]"
                                        placeholder="Brief description of the dish..."
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isVeg"
                                        checked={newItem.isVeg}
                                        onChange={e => setNewItem({ ...newItem, isVeg: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 bg-white/5 cursor-pointer accent-green-500"
                                    />
                                    <label htmlFor="isVeg" className="text-white text-sm cursor-pointer select-none">
                                        Vegetarian (Green Dot)
                                    </label>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <LiquidButton
                                        type="submit"
                                        disabled={adding}
                                        variant="primary"
                                        className="!px-8"
                                    >
                                        {adding && <Loader2 className="animate-spin w-4 h-4" />}
                                        Save Item
                                    </LiquidButton>
                                </div>
                            </form>
                        </LiquidCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                    <p className="text-gray-400 mt-2">Loading menu...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.length === 0 ? (
                        <LiquidCard className="col-span-2 text-center py-10 text-gray-400 border-dashed !bg-transparent">
                            <p>No items found. Add your first dish!</p>
                        </LiquidCard>
                    ) : (
                        items.map((item) => (
                            <LiquidCard
                                key={item.id}
                                className="!p-4 flex gap-4 hover:border-orange-500/30 group !bg-[#18181b]/40"
                                hoverEffect={true}
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                                                {item.name}
                                                <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${item.isVeg ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`} />
                                            </h3>
                                            <p className="text-sm text-gray-400">{item.category}</p>
                                        </div>
                                        <span className="font-bold text-orange-400 text-lg">₹{item.price}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>

                                    <div className="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </LiquidCard>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
