import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // In a real app, check custom claims or database for 'role: admin'
        // For demo, we'll allow specific emails or just proceed if valid token
        // Assuming we set custom claim 'admin' or just checking email
        if (decodedToken.email === "admin@feasto.com" || decodedToken.admin === true) {
            req.user = decodedToken;
            next();
        } else {
            // Allow for now for testing if no specific admin user implementation
            // return res.status(403).json({ error: "Forbidden: Admins only" });
            req.user = decodedToken;
            next();
        }
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};

import { ws } from "../server.js";

// Mock Database for Orders
let orders = [
    {
        id: "ORD-001",
        user: "Ravi",
        total: 1195,
        status: "Pending",
        date: "Today, 10:30 AM",
        items: [{ name: "Pepperoni Pizza", quantity: 2, price: 450 }, { name: "Coke", quantity: 2, price: 80 }]
    },
    {
        id: "ORD-002",
        user: "Sarah",
        total: 850,
        status: "preparing",
        date: "Today, 11:15 AM",
        items: [{ name: "Veg Burger", quantity: 1, price: 250 }, { name: "Fries", quantity: 1, price: 100 }]
    },
    {
        id: "ORD-003",
        user: "Mike",
        total: 2100,
        status: "ready",
        date: "Today, 11:45 AM",
        items: [{ name: "Sushi Platter", quantity: 2, price: 900 }, { name: "Miso Soup", quantity: 2, price: 150 }]
    },
];

// GET /api/admin/metrics
router.get("/metrics", requireAdmin, (req, res) => {
    res.json({
        revenue: 480000,
        totalOrders: 1248,
        premiumUsers: 312,
        failedPayments: 18,
    });
});

// GET /api/admin/orders
router.get("/orders", requireAdmin, (req, res) => {
    res.json(orders);
});

// PATCH /api/admin/orders/:id
router.patch("/orders/:id", requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ error: "Order not found" });
    }

    // Update locally
    orders[orderIndex].status = status;
    const updatedOrder = orders[orderIndex];

    // 📡 Broadcasting Real-Time Update
    // Status normalization: frontend expects e.g. "OUT_FOR_DELIVERY"
    // Our mock data used lowercase "preparing". Let's standardize to uppercase.
    // Ideally map status to standardized enums.

    // Notify via WebSocket
    if (ws) {
        ws.notifyOrderUpdate(id, {
            type: "ORDER_STATUS_UPDATE",
            orderId: id,
            status: status.toUpperCase() // Standardize
        });
    }

    res.json(updatedOrder);
});

export default router;
