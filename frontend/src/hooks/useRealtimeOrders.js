import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

export function useRealtimeOrders(restaurantId) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!restaurantId) {
            setLoading(false);
            return;
        }

        // Query: Get orders for this restaurant, ordered by newest first
        const q = query(
            collection(db, "orders"),
            where("restaurantId", "==", restaurantId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Helper to safely get date object from Firestore Timestamp
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : (doc.data().createdAt ? new Date(doc.data().createdAt) : null)
            }));
            setOrders(liveOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching realtime orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [restaurantId]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            // Optimistic update (optional, but let's stick to API wait for safety)
            // Call Backend API
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

            const res = await fetch(`${API_URL}/api/restaurant/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update status");
            }

            return true;
        } catch (error) {
            console.error("Failed to update status:", error);
            // Fallback to direct firestore update if API fails (legacy/admin mode)
            try {
                const orderRef = doc(db, "orders", orderId);
                await updateDoc(orderRef, {
                    status: newStatus,
                    updatedAt: new Date()
                });
                return true;
            } catch (fsError) {
                console.error("Firestore fallback also failed:", fsError);
                return false;
            }
        }
    };

    return { orders, loading, updateStatus };
}
