import express from "express";
import { requireRestaurantAdmin } from "../middleware/requireRestaurantAdmin.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Helper to get restaurantId, handling super_admin override
const getRestaurantId = (req) => {
    const { restaurantId, role } = req.admin;
    if (role === 'restaurant_admin') return restaurantId;
    if (role === 'super_admin') return req.query.restaurantId || restaurantId;
    return null;
}

/**
 * GET /api/restaurant/orders
 * Fetches orders for the logged-in restaurant admin
 */
router.get("/orders", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const query = req.db.collection("orders")
            .where("restaurantId", "==", restaurantId)
            .orderBy("createdAt", "desc");

        const ordersSnapshot = await query.get();

        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(orders);
    } catch (error) {
        console.error("Fetch Restaurant Orders Error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

/**
 * POST /api/restaurant/toggle
 * Toggles the 'isOpen' status of the restaurant
 */
router.post("/toggle", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const { isOpen } = req.body;
        if (typeof isOpen !== 'boolean') {
            return res.status(400).json({ error: "isOpen must be a boolean" });
        }

        await req.db.collection("restaurants").doc(restaurantId).update({
            isOpen: isOpen,
        });

        res.json({ success: true, isOpen });
    } catch (error) {
        console.error("Toggle Restaurant Status Error:", error);
        res.status(500).json({ error: "Failed to update restaurant status" });
    }
});

/**
 * GET /api/restaurant/me
 * Returns current restaurant details
 */
router.get("/me", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(404).json({ error: "Restaurant not found" });

        const doc = await req.db.collection("restaurants").doc(restaurantId).get();
        if (!doc.exists) return res.status(404).json({ error: "Restaurant data missing" });

        res.json({ id: doc.id, ...doc.data() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/* =========================================
   MENU MANAGEMENT API
   ========================================= */

/**
 * GET /api/restaurant/menu
 * Fetches all menu items for the restaurant
 */
router.get("/menu", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const snapshot = await req.db.collection("restaurants")
            .doc(restaurantId)
            .collection("menu")
            .get();

        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(items);
    } catch (error) {
        console.error("Fetch Menu Error:", error);
        res.status(500).json({ error: "Failed to fetch menu" });
    }
});

/**
 * POST /api/restaurant/menu
 * Adds a new menu item
 */
router.post("/menu", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const { name, price, description, image, category, isVeg } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: "Name and price are required" });
        }

        const newItem = {
            name,
            price: Number(price),
            description: description || "",
            image: image || "",
            category: category || "Main Course",
            isVeg: !!isVeg,
            isAvailable: true,
            createdAt: new Date().toISOString()
        };

        const docRef = await req.db.collection("restaurants")
            .doc(restaurantId)
            .collection("menu")
            .add(newItem);

        res.json({ id: docRef.id, ...newItem });
    } catch (error) {
        console.error("Add Menu Item Error:", error);
        res.status(500).json({ error: "Failed to add menu item" });
    }
});

/**
 * DELETE /api/restaurant/menu/:itemId
 * Deletes a menu item
 */
router.delete("/menu/:itemId", requireRestaurantAdmin, async (req, res) => {
    try {
        const restaurantId = getRestaurantId(req);
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const { itemId } = req.params;

        await req.db.collection("restaurants")
            .doc(restaurantId)
            .collection("menu")
            .doc(itemId)
            .delete();

        res.json({ success: true, id: itemId });
    } catch (error) {
        console.error("Delete Menu Item Error:", error);
        res.status(500).json({ error: "Failed to delete menu item" });
    }
});

export default router;
