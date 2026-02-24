import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Phone,
    Navigation,
    Package,
    ArrowLeft,
    Clock,
    IndianRupee,
    ChevronRight,
    Bike,
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import RiderMap from '../components/RiderMap';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function ActiveDeliveryPage() {
    const { id } = useParams(); // Order ID
    const navigate = useNavigate();
    const { currentUser, userToken } = useAuth();

    // State
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Live Location State
    const [riderLocation, setRiderLocation] = useState(null);
    const lastUpdateRef = useRef(0);

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${userToken}` }
    });

    // 1. Poll Order Details (The Source of Truth)
    useEffect(() => {
        if (!id || !userToken) return;

        const fetchOrder = async () => {
            try {
                // Using generic Orders API or Rider specific API if needed
                // Ideally create a specific endpoint for rider to view order details even if not "myorders" style
                // But let's assume getOrderById works for assigned rider
                // Or use existing /api/orders/:id
                const res = await axios.get(`${API_URL}/api/orders/${id}`, getAuthHeaders());
                const data = res.data;

                // Map Backend Status to Frontend UI Status
                // Backend: Ready, Driver_Assigned, Picked_Up, Out_for_delivery, Delivered
                // Frontend UI: assigned, picked_up, on_the_way, delivered
                let uiStatus = 'assigned';
                if (data.status === 'Picked_Up') uiStatus = 'picked_up';
                else if (data.status === 'Out_for_delivery') uiStatus = 'on_the_way';
                else if (data.status === 'Delivered') uiStatus = 'delivered';
                else if (data.status === 'Ready' || data.status === 'Driver_Assigned') uiStatus = 'assigned';

                setOrder({ ...data, status: uiStatus, _originalStatus: data.status });

                // Safety: If order delivered, auto-redirect (polite delay)
                if (data.status === 'Delivered') {
                    toast.success("Delivery Completed! Great work! 🎉");
                    setTimeout(() => navigate('/rider/dashboard'), 3000);
                }
                setLoading(false);
            } catch (error) {
                console.error("Order Fetch Error:", error);
                if (error.response && error.response.status === 404) {
                    toast.error("Order not found");
                    navigate('/rider/dashboard');
                }
                setLoading(false);
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [id, userToken, navigate]);

    // 1.5. Live Location Sync (Rider Only)
    useEffect(() => {
        if (!navigator.geolocation || !id || !order || !userToken) return;
        // Only track if active order
        const isActive = ['picked_up', 'on_the_way'].includes(order.status);
        if (!isActive) return;

        const watchId = navigator.geolocation.watchPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const newLoc = { lat: latitude, lng: longitude };
            setRiderLocation(newLoc);

            // Throttle Backend Updates (10 seconds)
            const now = Date.now();
            if (now - lastUpdateRef.current > 10000) {
                lastUpdateRef.current = now;
                try {
                    await axios.patch(`${API_URL}/api/rider/location`, {
                        lat: latitude,
                        lng: longitude,
                        heading: pos.coords.heading,
                        speed: pos.coords.speed,
                        orderId: id
                    }, getAuthHeaders());
                    // console.log("📍 Location synced to Backend");
                } catch (e) {
                    // console.error("Location sync failed", e);
                }
            }
        }, err => console.error(err), { enableHighAccuracy: true });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [id, order?.status, userToken]);

    // 2. Atomic Status Update Logic
    const handleStatusUpdate = async (nextUIStatus) => {
        if (!order) return;
        setActionLoading(true);

        try {
            // Map Frontend Next Status to Backend Status Enum
            let backendStatus = '';
            let msg = '';

            if (nextUIStatus === 'picked_up') {
                backendStatus = 'Picked_Up';
                msg = "Order Picked Up! 🎒";
            } else if (nextUIStatus === 'on_the_way') {
                backendStatus = 'Out_for_delivery';
                msg = "On the way to customer! 🚴";
            } else if (nextUIStatus === 'delivered') {
                backendStatus = 'Delivered';
                msg = "Order Delivered! 💵";
            }

            if (!backendStatus) return;

            await axios.patch(`${API_URL}/api/rider/orders/${id}/status`, {
                status: backendStatus
            }, getAuthHeaders());

            // Optimistic update or wait for poll (poll will catch up in 5s)
            // Ideally we force a refetch or update local state
            setOrder(prev => ({ ...prev, status: nextUIStatus }));
            toast.success(msg);

        } catch (err) {
            console.error(err);
            toast.error("Update failed. Try again.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Loading details...</p>
            </div>
        </div>
    );

    if (!order) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col pb-safe">

            {/* --- content --- */}
            <div className="flex-1 overflow-y-auto space-y-4">

                {/* 0. Live Map Header (Fixed Height) */}
                <div className="h-64 w-full bg-slate-800 relative z-0">
                    <RiderMap
                        pickupLocation={order.restaurantLocation} // Ensure backend sends this!
                        dropLocation={order.deliveryAddress ? JSON.parse(JSON.stringify(order.deliveryAddress)) : null} // Map logic might need tweaks if address structure differs
                        status={order.status}
                        riderLocation={riderLocation}
                    />

                    {/* Floating Back Button */}
                    <button
                        onClick={() => navigate('/rider/dashboard')}
                        className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md z-10 text-slate-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-4 space-y-6 pb-20"> {/* Padding for content below map */}

                    {/* 1. Status Tracker Card */}
                    <StatusProgress status={order.status} />

                    {/* 2. Restaurant Info (Pickup) */}
                    <div className="bg-slate-800 rounded-2xl p-5 border border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Package className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {/* Backend might not send restaurantName directly if populated, check structure */}
                                        {order.items?.[0]?.restaurantId || "Restaurant Partner"}
                                    </h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                        {/* Address might need to be fetched via enrichment or stored in Order */}
                                        {order.restaurantAddress || "Partner Location"}
                                    </p>
                                </div>
                                <button className="bg-slate-700 p-2.5 rounded-xl hover:bg-slate-600 transition-colors">
                                    <Navigation className="w-5 h-5 text-blue-400" />
                                </button>
                            </div>

                            {/* Order Items Summary */}
                            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700/50">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Items to Pickup</span>
                                    <span className="text-xs text-orange-400 font-bold">{order.items?.length || 1} Items</span>
                                </div>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {order.items?.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{item.quantity} x {item.name}</span>
                                        </li>
                                    ))}
                                    {(order.items?.length > 3) && <li className="text-xs text-gray-500 italic">+ {order.items.length - 3} more items</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 3. Customer Info (Drop) */}
                    <div className="bg-slate-800 rounded-2xl p-5 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Drop Location</span>
                                <h3 className="text-lg font-bold text-white mb-1">
                                    {order.userId || "Valued Customer"}
                                </h3>
                                <p className="text-sm text-gray-400 flex items-start gap-1.5 leading-snug">
                                    <MapPin className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                    {/* Handle deliveryAddress Map or Object */}
                                    {typeof order.deliveryAddress === 'object' ?
                                        Object.values(order.deliveryAddress).join(', ') :
                                        order.deliveryAddress || "Address details on map"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-slate-700 p-2.5 rounded-xl hover:bg-slate-600 transition-colors">
                                    <Phone className="w-5 h-5 text-green-400" />
                                </button>
                                <button className="bg-slate-700 p-2.5 rounded-xl hover:bg-slate-600 transition-colors">
                                    <Navigation className="w-5 h-5 text-blue-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                            <span className="text-sm font-medium text-green-400 flex items-center gap-1.5">
                                <IndianRupee className="w-4 h-4" />
                                Collect Cash
                            </span>
                            <span className="text-lg font-bold text-green-400">
                                ₹{order.total}
                            </span>
                        </div>
                    </div>

                </div>

                {/* --- Footer Action Button --- */}
                <div className="p-4 bg-slate-900 border-t border-gray-800 safe-bottom">
                    <OrderActionButton
                        status={order.status}
                        loading={actionLoading}
                        onUpdate={handleStatusUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

// --- Sub-Components ---

function StatusProgress({ status }) {
    // Status Mapping: 0: assigned, 1: picked_up, 2: on_the_way, 3: delivered
    const steps = ['assigned', 'picked_up', 'on_the_way', 'delivered'];
    const currentIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

    const labels = ["Assigned", "Picked Up", "On Way", "Delivered"];

    return (
        <div className="w-full py-2">
            <div className="flex justify-between items-center relative mb-2">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -z-0 rounded-full"></div>
                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 rounded-full transition-all duration-500"
                    style={{ width: `${(currentIndex / 3) * 100}%` }}
                ></div>

                {steps.map((s, i) => {
                    const isActive = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                        <div key={s} className="relative z-10 flex flex-col items-center">
                            <div className={`
                                w-4 h-4 rounded-full border-2 transition-all duration-300
                                ${isActive ? 'bg-green-500 border-green-500' : 'bg-slate-800 border-gray-600'}
                                ${isCurrent ? 'ring-4 ring-green-500/20 scale-125' : ''}
                            `}>
                                {isActive && <CheckCircle className="w-full h-full text-white p-[1px]" />}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between px-1">
                {labels.map((label, i) => (
                    <span key={i} className={`text-[10px] font-medium transition-colors ${i <= currentIndex ? 'text-green-400' : 'text-gray-600'}`}>
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function OrderActionButton({ status, loading, onUpdate }) {
    const config = {
        'assigned': {
            label: "Mark as Picked Up",
            icon: Package,
            next: 'picked_up',
            color: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
        },
        'picked_up': {
            label: "Start Delivery Route",
            icon: Bike,
            next: 'on_the_way',
            color: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
        },
        'on_the_way': {
            label: "Complete Delivery",
            icon: CheckCircle,
            next: 'delivered',
            color: 'bg-green-600 hover:bg-green-500 shadow-green-500/25'
        },
        'delivered': {
            label: "Delivery Completed",
            icon: CheckCircle,
            next: null,
            color: 'bg-gray-700 cursor-default'
        }
    };

    const currentAction = config[status] || config['assigned'];
    const Icon = currentAction.icon;

    if (!currentAction.next) {
        return (
            <div className="w-full bg-slate-800 text-green-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-green-500/20">
                <CheckCircle className="w-5 h-5" />
                Job Done!
            </div>
        );
    }

    return (
        <button
            onClick={() => onUpdate(currentAction.next)}
            disabled={loading}
            className={`
                w-full text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3
                ${currentAction.color} disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            {loading ? (
                <span className="animate-pulse">Updating...</span>
            ) : (
                <>
                    <Icon className="w-6 h-6" />
                    {currentAction.label}
                </>
            )}
            {!loading && <ChevronRight className="w-5 h-5 opacity-50" />}
        </button>
    );
}
