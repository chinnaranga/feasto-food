import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Matches backend/src/controllers/admin.controller.js
const ORDER_STATUSES = ["Pending", "Preparing", "Ready", "Out_for_delivery", "Delivered", "Cancelled", "Driver_Assigned", "Picked_Up"];

export default function LiveOrders({ limit = 20 }) {
    const { currentUser, userToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            if (!currentUser) return;
            const token = userToken || await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching live orders:", error);
            // toast.error("Failed to load live feed"); 
            // Suppress error toast on every poll if it fails
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [currentUser, userToken, limit]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = userToken || await currentUser.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Order updated to ${newStatus}`);
                fetchOrders(); // Refresh immediately
            } else {
                toast.error("Failed to update status");
            }
        } catch (e) {
            console.error("Update error", e);
            toast.error("Error updating status");
        }
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return "Just now";
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return "Invalid Date";
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-xs text-gray-400 font-mono uppercase tracking-wider border-b border-white/5">
                            <th className="p-4 pl-6">ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {orders.map(order => (
                                <motion.tr
                                    key={order._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="p-4 pl-6 font-mono text-xs text-gray-500">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                                {order.customerName ? order.customerName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-200">
                                                {order.customerName || `User ${order.userUid?.slice(0, 4)}`}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate">
                                        {order.items?.map(i => i.name).join(", ")}
                                    </td>

                                    <td className="p-4 text-xs font-mono text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </td>

                                    <td className="p-4 text-sm font-bold text-white">
                                        ₹{order.total}
                                    </td>

                                    <td className="p-4">
                                        <div className={`
                                           inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                           ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                ['Preparing', 'Out_for_delivery'].includes(order.status) ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${['Preparing', 'Out_for_delivery'].includes(order.status) ? 'bg-yellow-400 animate-pulse' : 'bg-current'}`} />
                                            {order.status.replace(/_/g, ' ')}
                                        </div>
                                    </td>

                                    <td className="p-4 pr-6 text-right">
                                        <select
                                            className="bg-black/40 text-xs text-white border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        >
                                            {ORDER_STATUSES.map(status => (
                                                <option key={status} value={status} className="bg-gray-900">
                                                    {status.replace(/_/g, ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
            {orders.length === 0 && (
                <div className="p-12 text-center text-gray-500 font-mono text-sm">
                    {loading ? "Loading live feed..." : "-- SYSTEM IDLE --"}
                </div>
            )}
        </div>
    );
}
