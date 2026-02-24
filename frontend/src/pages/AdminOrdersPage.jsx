import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Filter,
  Trash2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  Pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  Paid: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  Completed: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  preparing: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  ready: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  ordered: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
};

const statusIcons = {
  Pending: Clock,
  Paid: CreditCard,
  Completed: CheckCircle,
  Cancelled: XCircle,
  preparing: Clock,
  ready: CheckCircle,
};
// import { useOrders } from "../context/OrderContext"; // Removed in favor of API
import { useAuth } from "../context/AuthContext";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // for auth token if needed
  // const { orders, updateOrderStatus, clearOrders } = useOrders(); 

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch orders from API
  React.useEffect(() => {
    fetch("/api/admin/orders", {
      headers: {
        "Authorization": `Bearer ${currentUser?.accessToken || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(err => toast.error("Failed to fetch orders"));
  }, [currentUser]);

  const updateOrderStatus = (orderId, newStatus) => {
    fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentUser?.accessToken || ""}`
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(updated => {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        // toast.success handled in input change or here
      })
      .catch(err => toast.error("Update failed"));
  };

  const handleClearAll = () => {
    toast.error("Clear all disabled in API mode");
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f12] text-white pt-24 pb-16 px-6">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/admin")}
            className="rounded-lg p-2 hover:bg-white/5 border border-white/10"
          >
            <ArrowLeft />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="text-orange-400" />
              Manage Orders
            </h1>
            <p className="text-gray-400 text-sm">{orders.length} total orders</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter size={14} />
            Filter:
          </div>
          {["all", "Pending", "Paid", "Completed", "Cancelled"].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                ? "bg-orange-500 text-white"
                : "bg-[#18181b] text-gray-400 border border-white/10 hover:border-orange-500/30"
                }`}
            >
              {f === "all" ? "All Orders" : f}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearAll}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
          >
            <Trash2 size={14} />
            Clear All
          </motion.button>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter !== "all" ? "Try a different filter" : "Orders will appear here"}
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order) => {
                const statusStyle = statusColors[order.status] || statusColors.Pending;
                const StatusIcon = statusIcons[order.status] || Clock;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-[#18181b] border border-white/5 rounded-2xl p-6 hover:border-orange-500/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${statusStyle.bg} flex items-center justify-center`}>
                          <StatusIcon className={statusStyle.text} size={20} />
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg">Order #{order.id}</h2>
                          <p className="text-gray-400 text-sm">{order.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-orange-400">₹{order.total}</p>

                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value);
                              toast.success(`Order status updated to ${e.target.value}`);
                            }}
                            className={`appearance-none ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none cursor-pointer`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {order.items.slice(0, 4).map((item, i) => (
                          <div key={i} className="bg-black/30 rounded-xl px-3 py-2">
                            <p className="text-gray-300 truncate">{item.name}</p>
                            <p className="text-gray-500 text-xs">
                              x{item.quantity} • ₹{(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="bg-black/30 rounded-xl px-3 py-2 flex items-center justify-center text-gray-500 text-sm">
                            +{order.items.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
