import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase.js"; // Ensure direct firestore access for real-time
import { doc, onSnapshot } from "firebase/firestore";
import SEO from "../components/SEO";
import StatusTimeline from "../components/StatusTimeline";
import LiveTrackingMap from "../components/LiveTrackingMap";
import { Phone, ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";

/* -------------------------------
   COMPONENT
-------------------------------- */
export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [order, setOrder] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  /* -------------------------------
     REAL-TIME LISTENERS
  -------------------------------- */
  useEffect(() => {
    if (!orderId) return;

    // 1. Listen to Order Document
    const orderRef = doc(db, "orders", orderId);
    const unsubOrder = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
        setLoading(false);
      } else {
        setError("Order not found");
        setLoading(false);
      }
    }, (err) => {
      console.error("Order Listener Error:", err);
      setError("Failed to track order");
      setLoading(false);
    });

    // 2. Listen to Rider Tracking (if status warrants)
    // Note: Tracking doc ID usually matches Order ID in our schema
    const trackingRef = doc(db, "tracking", orderId);
    const unsubTracking = onSnapshot(trackingRef, (docSnap) => {
      if (docSnap.exists()) {
        setRiderLocation(docSnap.data());
      }
    });

    return () => {
      unsubOrder();
      unsubTracking();
    };
  }, [orderId]);


  /* -------------------------------
     DERIVED STATE
  -------------------------------- */
  const currentStatus = order?.status || "Pending";
  const isLive = ["Out for delivery", "Delivered"].includes(currentStatus);
  const totalAmount = order?.totalAmount ?? order?.total ?? 0;

  const addressString = typeof order?.deliveryAddress === 'object'
    ? order.deliveryAddress.formatted_address || order.deliveryAddress.address || "Delivery Address"
    : order?.deliveryAddress || "Delivery Address";

  // Simulate or Parse Locations
  // In a real app, restaurantLocation would come from order.restaurantData.location
  const restaurantLocation = { lat: 12.9716, lng: 77.5946 }; // Default BLR
  // Rider location from firestore or null
  const currentRiderPos = riderLocation ? { lat: riderLocation.lat, lng: riderLocation.lng, heading: riderLocation.heading } : null;
  // Customer location (simulated or from address geocode - assuming default for now if missing)
  const customerLocation = { lat: 12.9352, lng: 77.6245 }; // Example Koramangala


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center text-white space-y-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white pt-20 relative overflow-hidden">

      <SEO
        title={`Status: ${currentStatus}`}
        description={`Track order #${orderId}`}
      />

      {/* 
         LAYOUT STRATEGY: 
         - Top: Floating Status & Map
         - Bottom Sheet / Panel: Order Details
      */}

      <div className="h-[65vh] w-full relative z-0">
        <LiveTrackingMap
          restaurantLocation={restaurantLocation}
          customerLocation={customerLocation}
          riderLocation={currentRiderPos}
        />

        {/* Floating Rider Card (If Out for delivery) */}
        {isLive && currentRiderPos && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                🤠
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Rider Name</h4>
                <p className="text-xs text-blue-400">Arriving in 12 mins</p>
              </div>
              <button className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                <Phone size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Info Panel */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 -mt-6 bg-[#0f0f12] rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] min-h-[40vh] pb-20"
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          <div className="w-12 h-1.5 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors" />
        </div>

        <div className="px-6 md:px-12 py-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {currentStatus === "Delivered" ? "Order Delivered!" : "Order in Progress"}
              </h1>
              <p className="text-gray-400 text-sm mt-1">Order #{order.id.slice(0, 8)} • {order.items?.length} Items</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-xl font-bold text-white">₹{totalAmount}</p>
            </div>
          </div>

          {/* Animated Timeline */}
          <StatusTimeline currentStatus={currentStatus} />

          {/* Actions */}
          {currentStatus === "Delivered" && (
            <div className="mt-4 mb-8">
              <Button
                variant="primary"
                className="w-full justify-center py-4 text-lg shadow-lg shadow-orange-500/20"
                icon={ShoppingBag}
                onClick={() => navigate("/restaurants")}
              >
                Order Again
              </Button>
            </div>
          )}

          {/* Toggleable Details */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="flex items-center justify-between w-full text-left group"
            >
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">Order Summary & Address</span>
              {isDetailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isDetailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {/* Address */}
                    <div className="bg-white/5 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Delivering To</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{addressString}</p>
                    </div>

                    {/* Items */}
                    <div className="bg-white/5 p-4 rounded-xl space-y-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Items</p>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-300"><span className="text-orange-500 font-mono text-xs mr-2">x{item.quantity}</span> {item.name}</span>
                          <span className="text-gray-400">₹{(item.price || 0) * (item.quantity || 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
