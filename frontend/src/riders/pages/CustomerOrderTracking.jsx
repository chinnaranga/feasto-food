import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Navigation, Phone, CheckCircle, Package } from 'lucide-react';
import RiderMap from '../components/RiderMap';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import RateOrderModal from '../../components/RateOrderModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const db = getFirestore();

export default function CustomerOrderTracking() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRateModal, setShowRateModal] = useState(false);

    const [riderLocation, setRiderLocation] = useState(null);


    const [hasOpenedModal, setHasOpenedModal] = useState(false);

    // 1. Listen to Order
    useEffect(() => {
        if (!id) return;

        const sub = onSnapshot(doc(db, "orders", id), (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                setOrder(data);

                // Auto-open rating modal if delivered and not yet rated
                if (data.status === 'delivered' && !hasOpenedModal && !data.isRated) {
                    setTimeout(() => setShowRateModal(true), 1500);
                    setHasOpenedModal(true);
                }
            }
            setLoading(false);
        });

        return () => sub();
    }, [id, hasOpenedModal]);

    // Handle Rating Submission
    const handleRatingSubmit = async ({ foodRating, riderRating, comment }) => {
        try {
            const token = localStorage.getItem('token'); // or getAuth().currentUser.getIdToken()
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Rate Restaurant
            if (foodRating && order.restaurantId) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
                    userId: order.userId, // or auth user
                    targetId: order.restaurantId,
                    targetType: 'restaurant',
                    orderId: order.id,
                    rating: foodRating,
                    comment
                }, config);
            }

            // 2. Rate Rider
            if (riderRating && order.riderId) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
                    userId: order.userId,
                    targetId: order.riderId,
                    targetType: 'rider',
                    orderId: order.id,
                    rating: riderRating,
                    comment
                }, config);
            }

            toast.success("Thanks for your feedback!");
            setShowRateModal(false);
        } catch (err) {
            console.error(err);
            toast.error("Couldn't submit review");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Tracking...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;
    useEffect(() => {
        if (!order?.riderId) return;

        const riderSub = onSnapshot(doc(db, "riders", order.riderId), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.location) {
                    setRiderLocation(data.location);
                }
            }
        });

        return () => riderSub();
    }, [order?.riderId]);

    if (loading) return <div className="p-10 text-center">Loading Tracking...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    const getStatusMessage = (s) => {
        switch (s) {
            case 'assigned': return "Rider is heading to restaurant";
            case 'picked_up': return "Order picked up! On the way.";
            case 'on_the_way': return "Rider is near you!";
            case 'delivered': return "Enjoy your meal! 😋";
            default: return "Processing order...";
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-white">
            {/* Map Area */}
            <div className="flex-1 relative bg-slate-100">
                <RiderMap
                    pickupLocation={order.restaurantLocation}
                    dropLocation={order.customerLocation}
                    riderLocation={riderLocation}
                    status={order.status}
                    readOnly={true}
                />

                {/* Floating Status Card */}
                <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 z-10 max-w-md mx-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-bold text-gray-800 text-lg">
                                {getStatusMessage(order.status)}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                ETA: {order.duration || '15 mins'}
                            </p>
                        </div>
                        <div className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                        `}>
                            {order.status?.replace(/_/g, " ")}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div
                            className="bg-green-500 h-full transition-all duration-1000"
                            style={{
                                width: order.status === 'delivered' ? '100%' :
                                    order.status === 'on_the_way' ? '75%' :
                                        order.status === 'picked_up' ? '50%' : '25%'
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet Info */}
            <div className="bg-white p-5 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] -mt-6 relative z-20">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
                        <Navigation className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Delivery Partner</h3>
                        <p className="text-sm text-gray-500">Rider #{order.riderId?.slice(0, 5) || '...'}</p>
                    </div>
                    <button className="ml-auto bg-green-100 p-3 rounded-full text-green-600">
                        <Phone className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 border-t pt-4">
                    <div className="flex gap-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-bold text-gray-800">{order.restaurantName}</p>
                            <p className="text-xs text-gray-500">{order.items?.length} Items</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="font-bold text-gray-800">Your Location</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{order.shippingAddress?.street}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <RateOrderModal
                isOpen={showRateModal}
                onClose={() => setShowRateModal(false)}
                order={order}
                onSubmit={handleRatingSubmit}
            />
        </div>
    );
}
