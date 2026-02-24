import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Plus,
  Store,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  ClipboardList,
  Settings,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import OrdersTable from "../components/OrdersTable";

// Sample restaurants
const sampleRestaurants = [
  { id: 1, name: "Pizza Palace" },
  { id: 2, name: "Burger Hub" },
  { id: 3, name: "Sushi World" },
];

const stats = [
  { label: "Total Revenue", value: "₹1,24,500", icon: DollarSign, color: "green" },
  { label: "Active Orders", value: "23", icon: Package, color: "orange" },
  { label: "Customers", value: "1,240", icon: Users, color: "blue" },
  { label: "Growth", value: "+12%", icon: TrendingUp, color: "purple" },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0].id);
  const [menu, setMenu] = useState({});
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  // Load menu from localStorage
  useEffect(() => {
    const savedMenu = JSON.parse(localStorage.getItem("menuByRestaurant")) || {};
    setMenu(savedMenu);
  }, []);

  // Save menu whenever it changes
  useEffect(() => {
    localStorage.setItem("menuByRestaurant", JSON.stringify(menu));
  }, [menu]);

  const handleAddOrEdit = () => {
    if (!name || !price || !category) {
      toast.error("Please fill all fields");
      return;
    }

    const newItem = {
      id: editingItemId || Date.now(),
      name,
      price: parseFloat(price),
      category,
    };

    setMenu((prev) => {
      const currentMenu = prev[selectedRestaurant] || [];
      const updatedMenu = editingItemId
        ? currentMenu.map((item) => (item.id === editingItemId ? newItem : item))
        : [...currentMenu, newItem];

      return { ...prev, [selectedRestaurant]: updatedMenu };
    });

    toast.success(editingItemId ? "Item updated!" : "Item added!");
    setName("");
    setPrice("");
    setCategory("");
    setEditingItemId(null);
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setEditingItemId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenu((prev) => ({
        ...prev,
        [selectedRestaurant]: prev[selectedRestaurant].filter((item) => item.id !== id),
      }));
      toast.success("Item deleted");
    }
  };

  const currentMenu = menu[selectedRestaurant] || [];

  return (
    <div className="relative min-h-screen bg-[#0f0f12] text-white pt-24 pb-16 px-6">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Settings className="text-orange-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage restaurants, menus, and orders</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-[#18181b] border border-white/5 rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Orders Table (New) */}
        <div className="mb-10">
          <OrdersTable />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 bg-orange-500 px-5 py-3 rounded-xl font-semibold"
          >
            <ClipboardList size={18} />
            View All Orders
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#18181b] border border-white/10 px-5 py-3 rounded-xl font-semibold hover:border-orange-500/30"
          >
            <Store size={18} />
            Add Restaurant
          </motion.button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Restaurant Selector + Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Restaurant Selector */}
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Store className="text-orange-400" size={18} />
                Select Restaurant
              </h2>
              <div className="relative">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(parseInt(e.target.value))}
                  className="w-full appearance-none bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Add/Edit Form */}
            <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingItemId ? "Edit Food Item" : "Add Food Item"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Food Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddOrEdit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-3 rounded-xl font-semibold"
                >
                  <Plus size={16} className="inline mr-2" />
                  {editingItemId ? "Update Item" : "Add Item"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Menu Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold">Menu Items</h2>
              <p className="text-sm text-gray-400">{currentMenu.length} items</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentMenu.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-orange-400">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/5 rounded-lg text-sm">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {currentMenu.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No items in this restaurant yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;