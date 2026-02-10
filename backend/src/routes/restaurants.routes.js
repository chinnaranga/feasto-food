import express from "express";
import { db } from "../config/firebase.js";
import admin from "firebase-admin";

const router = express.Router();

// Middleware to verify Firebase token for restaurants
const requireRestaurantAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// GET /api/restaurant/me
router.get("/me", requireRestaurantAuth, async (req, res) => {
    try {
        const { uid, email } = req.user;

        // Query by ownerId (preferred) or ownerEmail (legacy/seed data)
        const restaurantsRef = db.collection("restaurants");

        // Try finding by ownerId first
        let snapshot = await restaurantsRef.where("ownerId", "==", uid).limit(1).get();

        // If not found, try by ownerEmail
        if (snapshot.empty && email) {
            snapshot = await restaurantsRef.where("ownerEmail", "==", email).limit(1).get();
        }

        if (snapshot.empty) {
            return res.status(404).json({ message: "No restaurant profile found for this user." });
        }

        const doc = snapshot.docs[0];
        const restaurantData = { id: doc.id, ...doc.data() };

        res.json(restaurantData);
    } catch (error) {
        console.error("Error fetching restaurant profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/restaurant/orders/:orderId/status
router.patch("/orders/:orderId/status", requireRestaurantAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const { uid, email } = req.user;

        if (!status) return res.status(400).json({ message: "Status is required" });

        const orderRef = db.collection("orders").doc(orderId);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({ message: "Order not found" });
        }

        const orderData = orderSnap.data();

        // Verify ownership: Does this order belong to a restaurant owned by this user?
        // We can check if orderData.restaurantId matches a restaurant owned by user.
        // OR rely on the fact that if they have access to the dashboard of this restaurant (via /me), they can update.
        // But for strictness:

        // 1. Get user's restaurant
        // Reuse logic from /me or just query again.
        const restaurantsRef = db.collection("restaurants");
        let restaurantSnap = await restaurantsRef.where("ownerId", "==", uid).limit(1).get();
        if (restaurantSnap.empty && email) {
            restaurantSnap = await restaurantsRef.where("ownerEmail", "==", email).limit(1).get();
        }

        if (restaurantSnap.empty) {
            return res.status(403).json({ message: "Unauthorized: You do not own a restaurant" });
        }

        const restaurantId = restaurantSnap.docs[0].id;

        // 2. Check match
        // Note: old orders might not have restaurantId. In that case, we might block or allow if loose.
        // But since we just added restaurantId to new orders, let's enforce it for new ones.
        if (orderData.restaurantId && orderData.restaurantId !== restaurantId) {
            return res.status(403).json({ message: "Unauthorized: Order does not belong to your restaurant" });
        }

        // Update status
        await orderRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.json({ success: true, message: "Order status updated" });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
