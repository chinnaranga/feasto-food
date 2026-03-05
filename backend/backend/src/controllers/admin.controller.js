import Order from "../models/Order.js";
import Rider from "../models/Rider.js";
import User from "../models/User.js";
import { createNotification } from "./notification.controller.js";


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
        // 1. Total Users (Exclude admins/riders if strict, or just all)
        // Adjust query based on needs. Here we count all 'user' role docs.
        const totalUsers = await User.countDocuments({ role: 'user' }); // Requires User import

        // 2. Total Orders
        const totalOrders = await Order.countDocuments();

        // 3. Revenue (Total Paid)
        const revenueAgg = await Order.aggregate([
            { $match: { status: { $in: ['Paid', 'Delivered', 'Completed'] } } }, // Add other paid statuses
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 4. Active Orders
        const activeOrders = await Order.countDocuments({
            status: { $in: ['Pending', 'Preparing', 'Ready', 'Out_for_delivery', 'Driver_Assigned', 'Picked_Up'] }
        });

        // 5. Orders Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // 6. Revenue Graph (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueGraphData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: { $in: ['Paid', 'Delivered'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days for the graph
        const revenueGraph = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = revenueGraphData.find(item => item._id === dateStr);
            revenueGraph.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
                revenue: found ? found.revenue : 0,
                orders: found ? found.orders : 0
            });
        }

        // 7. Traffic Graph (Mock based on real RPM if available, or static pattern)
        // Ideally, use a Redis counter or Request Log model. For now, we simulate a curve.
        const trafficGraph = [
            { name: '00:00', requests: 120 },
            { name: '04:00', requests: 80 },
            { name: '08:00', requests: 450 },
            { name: '12:00', requests: 1200 },
            { name: '16:00', requests: 950 },
            { name: '20:00', requests: 1500 },
            { name: '23:59', requests: 300 },
        ];

        // 8. RPM (Requests Per Minute) - Mock or calculate
        const rpm = Math.floor(Math.random() * (120 - 40 + 1) + 40); // Random 40-120

        const stats = {
            rpm,
            totalOrders,
            totalRevenue,
            activeOrders,
            ordersToday,
            totalUsers,
            revenueGraph,
            trafficGraph,
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

        // Emit notification to user
        await createNotification(order.userId, {
            title: "Order Status Updated",
            description: `Your order status is now ${status.replace(/_/g, ' ')}.`,
            type: "order",
            metadata: { orderId: order._id.toString() }
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
        const riders = await Rider.find({}).sort({ updatedAt: -1 });
        res.json(riders);
    } catch (error) {
        console.error("Admin Get Riders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
