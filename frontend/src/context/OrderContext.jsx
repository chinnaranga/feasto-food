import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

// 1. Create Context and Export it (Safety for ReferenceErrors)
export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's orders real-time
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(newOrders);
      setLoading(false);

      // Handle Notifications for status changes (skip initial load)
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const data = change.doc.data();
          const prevStatus = orders.find(o => o.id === change.doc.id)?.status;

          if (data.status && data.status !== prevStatus) {
            // Determine toast type and message
            let type = "info";
            let msg = `Order #${change.doc.id.slice(-6)} update: ${data.status}`;

            switch (data.status.toLowerCase()) {
              case "preparing": msg = "👨‍🍳 Your order is being prepared!"; type = "info"; break;
              case "ready": msg = "✅ Your order is ready for pickup/delivery!"; type = "success"; break;
              case "out_for_delivery": msg = "🚚 Rider has picked up your order!"; type = "info"; break;
              case "delivered": msg = "🎉 Order Delivered! Enjoy your meal."; type = "success"; break;
              case "cancelled": msg = "❌ Order was cancelled."; type = "error"; break;
            }

            addToast(msg, type);
          }
        }
      });
    }, (err) => {
      // 🛡️ PRODUCTION SAFETY: Handle Missing Index Gracefully
      if (err.code === "failed-precondition" || err.message.includes("requires an index")) {
        console.error("⚠️ Firestore Index Missing. Orders temporarily unavailable.");
        // Do not crash - just show empty list
        setOrders([]);
      } else {
        console.error("OrderContext Error:", err);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser, addToast]); // Simplified dependency array


  // Add a new order
  const addOrder = async (order) => {
    try {
      const restaurantId = order.items?.[0]?.restaurantId || "unknown";

      const orderData = {
        ...order,
        userId: currentUser?.uid || "guest",
        restaurantId,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      delete orderData.id;
      orderData.displayId = order.id;

      await addDoc(collection(db, "orders"), orderData);
    } catch (error) {
      console.error("Failed to add order", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const clearOrders = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

// Robust Hook
export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
