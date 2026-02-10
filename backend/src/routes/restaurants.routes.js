import express from "express";
import admin from "firebase-admin";
import { getRestaurantProfile, updateRestaurantOrderStatus } from "../controllers/restaurants.controller.js";

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
router.get("/me", requireRestaurantAuth, getRestaurantProfile);

// PATCH /api/restaurant/orders/:orderId/status
router.patch("/orders/:orderId/status", requireRestaurantAuth, updateRestaurantOrderStatus);

export default router;
