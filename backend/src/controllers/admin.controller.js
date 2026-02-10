import Order from "../models/Order.js";

// @desc    Get all orders (paginated)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const { limit = 50, status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));

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
        const totalOrders = await Order.countDocuments();

        const revenueAgg = await Order.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const activeOrders = await Order.countDocuments({
            status: { $in: ['Pending', 'Preparing', 'Ready', 'Out for delivery', 'PENDING', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'] }
        });

        // Orders Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        const stats = {
            totalOrders,
            totalRevenue,
            activeOrders,
            ordersToday,
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

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

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
