import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  MapPin,
  Home,
  Building,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const ManageAddressesPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      nickname: "Home",
      details: "221B Baker Street, London, UK",
      icon: "home",
    },
    {
      id: 2,
      nickname: "Work",
      details: "10 Downing Street, London, UK",
      icon: "building",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: null,
    nickname: "",
    details: "",
    icon: "home",
  });

  const handleSave = () => {
    if (!newAddress.nickname || !newAddress.details) {
      toast.error("Please fill all fields");
      return;
    }

    if (newAddress.id) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === newAddress.id ? { ...newAddress } : addr
        )
      );
      toast.success("Address updated!");
    } else {
      setAddresses((prev) => [
        ...prev,
        { ...newAddress, id: Date.now() },
      ]);
      toast.success("Address added!");
    }
    setNewAddress({ id: null, nickname: "", details: "", icon: "home" });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast.success("Address deleted");
  };

  const handleEdit = (addr) => {
    setNewAddress(addr);
    setIsModalOpen(true);
  };

  const getIcon = (type) => {
    return type === "building" ? Building : Home;
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f12] text-white pt-24 pb-16 px-6">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 hover:bg-white/5 border border-white/10"
          >
            <ArrowLeft />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="text-orange-400" />
              Manage Addresses
            </h1>
            <p className="text-gray-400 text-sm">Add and manage your delivery addresses</p>
          </div>
        </motion.div>

        {/* Add New Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setNewAddress({ id: null, nickname: "", details: "", icon: "home" });
            setIsModalOpen(true);
          }}
          className="w-full mb-8 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 py-4 rounded-2xl font-semibold shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          Add New Address
        </motion.button>

        {/* Address Cards */}
        <motion.div
          layout
          className="grid md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {addresses.map((addr) => {
              const Icon = getIcon(addr.icon);
              return (
                <motion.div
                  key={addr.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-[#18181b] border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Icon className="text-orange-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {addr.nickname}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{addr.details}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(addr)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm hover:border-orange-500/30"
                    >
                      <Edit size={14} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(addr.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {addresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No addresses saved yet</p>
            <p className="text-gray-500 text-sm mt-2">Add your first delivery address</p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {newAddress.id ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Icon Selector */}
                <div className="flex gap-3">
                  {[
                    { id: "home", icon: Home, label: "Home" },
                    { id: "building", icon: Building, label: "Work" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setNewAddress({ ...newAddress, icon: option.id })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${newAddress.icon === option.id
                          ? "bg-orange-500/20 border-orange-500 text-orange-400"
                          : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                    >
                      <option.icon size={16} />
                      {option.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Nickname (e.g. Home, Work)"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50"
                  value={newAddress.nickname}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, nickname: e.target.value })
                  }
                />
                <textarea
                  placeholder="Full Address"
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/50 resize-none"
                  value={newAddress.details}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, details: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAddressesPage;