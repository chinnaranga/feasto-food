import express from "express";
import admin from "firebase-admin";
import {
    getRestaurantProfile,
    updateRestaurantOrderStatus,
    getMenu,
    updateMenu,
    toggleRestaurantStatus,
    addMenuItem,
    deleteMenuItem,
    getAllRestaurants,
    getRestaurantById
} from "../controllers/restaurants.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllRestaurants);

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
        console.error("❌ Firebase Auth Verification Error:", error.message);
        res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            error: error.message,
            code: error.code
        });
    }
};

// GET /api/restaurant/me
router.get("/me", requireRestaurantAuth, getRestaurantProfile);

// PATCH /api/restaurant/orders/:orderId/status
router.patch("/orders/:orderId/status", requireRestaurantAuth, updateRestaurantOrderStatus);

// Menu Management
router.get("/menu", requireRestaurantAuth, getMenu);
router.put("/menu", requireRestaurantAuth, updateMenu);
router.post("/menu", requireRestaurantAuth, addMenuItem);
router.delete("/menu/:itemId", requireRestaurantAuth, deleteMenuItem);

// Status Management
router.post("/toggle", requireRestaurantAuth, toggleRestaurantStatus);

// GET /api/restaurant/:id (Must be last)
router.get("/:id", getRestaurantById);

export default router;
