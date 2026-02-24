import React, { useState, useMemo } from "react";
import { formatOrderDate } from "../utils/formatDate";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import {
  Search,
  Package,
  ChevronRight,
  Clock,
  MapPin,
  ShoppingBag,
  RefreshCw
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import PageLoader from "../components/PageLoader";

const statusConfig = {
  Pending: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  Preparing: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Preparing" },
  Ready: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Ready" },
  "Out for delivery": { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "On the Way" },
  Delivered: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Delivered" },
  Cancelled: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Cancelled" },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        const idMatch = order.id?.toLowerCase().includes(searchQuery.toLowerCase());
        const itemMatch = order.items?.some(item =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesStatus && (searchQuery === "" || idMatch || itemMatch);
      });
  }, [orders, statusFilter, searchQuery]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white pt-24 pb-20 px-4 md:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-[#0f0f12] to-[#0f0f12]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent tracking-tight">
              Your Orders
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Track, manage, and reorder from your history.</p>
          </div>
          <Button
            variant="primary"
            className="shadow-lg shadow-orange-500/20"
            icon={ShoppingBag}
            onClick={() => navigate("/restaurants")}
          >
            Order Food
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="sticky top-20 z-30 p-4 -mx-4 md:mx-0 md:p-0 bg-[#0f0f12]/80 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none border-b border-white/5 md:border-none">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search orders..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-80 bg-white/5 border-white/10 focus:border-orange-500/50"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {["All", "Preparing", "Out for delivery", "Delivered", "Cancelled"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${statusFilter === status
                    ? "bg-white text-black border-white shadow-lg shadow-white/10"
                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                >
                  {status === "Out for delivery" ? "On the Way" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="group relative overflow-hidden bg-[#18181b]/60 hover:bg-[#18181b] border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Package className="text-orange-500" size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                            {order.restaurant || "AeroBite Order"}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono mt-0.5">#{order.id.slice(0, 8)}</p>
                        </div>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusConfig[order.status]?.color || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-6">
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date</p>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={14} />
                          <span>{formatOrderDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Delivered To</p>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin size={14} />
                          <span className="truncate block">{order.deliveryAddress || "Home"}</span>
                        </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 text-right md:text-left">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <span className="text-lg font-bold text-white">₹{order.total}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items in this order
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 text-sm font-medium hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement Reorder
                            navigate(`/restaurants`);
                          }}
                        >
                          <RefreshCw size={14} /> Reorder
                        </button>
                        <div className="flex items-center text-gray-400 text-sm group-hover:text-white transition-colors">
                          View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="No orders found"
                description={searchQuery ? "Try adjusting your search or filters" : "Looks like you haven't ordered anything yet."}
                actionLabel="Browse Restaurants"
                onAction={() => navigate("/restaurants")}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}