import { db } from "../config/firebase.js";

// @desc    Get all orders (paginated)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const { limit = 50, status } = req.query;
        let ordersRef = db.collection('orders').orderBy('createdAt', 'desc').limit(Number(limit));

        if (status) {
            ordersRef = db.collection('orders').where('status', '==', status).orderBy('createdAt', 'desc').limit(Number(limit));
        }

        const snapshot = await ordersRef.get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.json(orders);
    } catch (error) {
        console.error("Admin Get Orders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req, res) => {
    try {
        // Calculate aggregations
        // Note: For high volume, use distributed counters. For now, reading is fine.

        // 1. Total Orders & Revenue
        const ordersSnapshot = await db.collection('orders').get(); // potentially heavy
        let totalOrders = ordersSnapshot.size;
        let totalRevenue = 0;
        let activeOrders = 0;

        ordersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'Paid') {
                totalRevenue += (data.total || 0);
            }
            if (['Pending', 'Preparing', 'Ready', 'Out for delivery'].includes(data.status)) {
                activeOrders++;
            }
        });

        // 2. Total Users
        // const usersSnapshot = await db.collection('users').count().get();
        // const totalUsers = usersSnapshot.data().count; 
        // using count() aggregation is cheaper if firebase-admin supports it (it does in newer versions)

        const stats = {
            totalOrders,
            totalRevenue,
            activeOrders,
            systemHealth: "Optimal"
        };

        res.json(stats);
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Resulting status required" });
        }

        const orderRef = db.collection('orders').doc(id);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            return res.status(404).json({ error: "Order not found" });
        }

        await orderRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.json({ id, status, message: "Order status updated" });
    } catch (error) {
        console.error("Admin Update Order Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get all riders
// @route   GET /api/admin/riders
// @access  Private/Admin
export const getAllRiders = async (req, res) => {
    try {
        // Fetch users with role 'rider' or from 'riders' collection if separated
        // Assuming 'riders' collection stores status/location/wallet
        const ridersRef = db.collection('riders');
        const snapshot = await ridersRef.get();

        const riders = [];
        snapshot.forEach(doc => {
            riders.push({ id: doc.id, ...doc.data() });
        });

        res.json(riders);
    } catch (error) {
        console.error("Admin Get Riders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
