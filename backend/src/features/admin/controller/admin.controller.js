import Order from "../models/Order.js";
import Rider from "../models/Rider.js";
import User from "../models/User.js";
import DeviceOTP from "../models/DeviceOTP.js";
import { createNotification } from "./notification.controller.js";
import { db } from "../config/firebase.js";


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
            const revenue = found ? found.revenue : 0;
            revenueGraph.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
                revenue: revenue,
                payout: revenue * 0.8, // Assuming 80% payout for mock
                orders: found ? found.orders : 0
            });
        }

        // 7. Traffic Graph — orders per 4-hour slot today as a proxy for activity
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const hourlyOrders = await Order.aggregate([
            { $match: { createdAt: { $gte: todayStart } } },
            {
                $group: {
                    _id: { $floor: { $divide: [{ $hour: '$createdAt' }, 4] } },
                    requests: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const slotLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
        const trafficGraph = slotLabels.map((name, i) => {
            const found = hourlyOrders.find(h => h._id === i);
            return { name, requests: found ? found.requests : 0 };
        });

        // 8. RPM — estimate from total orders today spread over time elapsed
        const hoursElapsed = Math.max(1, new Date().getHours());
        const rpm = Math.round(ordersToday / (hoursElapsed * 60) * 100) / 100 || 0;

        // 9. Rider stats
        const totalRiders = await Rider.countDocuments();
        const activeRiders = await Rider.countDocuments({ activeDelivery: { $ne: null } });
        const onlineRiders = await Rider.countDocuments({ isOnline: true });

        // 10. Activity feed
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(4);
        const activityFeed = recentOrders.map((o, idx) => ({
            id: idx,
            type: 'order',
            text: `Order ${o._id.toString().slice(-4)} status updated to ${o.status}`,
            time: 'Recently'
        }));

        const stats = {
            rpm,
            totalOrders,
            totalRevenue: totalRevenue || 0,
            activeOrders,
            ordersToday,
            totalUsers,
            revenueGraph,
            trafficGraph,
            totalRiders,
            activeRiders,
            onlineRiders,
            activityFeed,
            revenueToday: ordersToday > 0 ? (await Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $in: ['Paid', 'Delivered'] } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ])).reduce((acc, r) => acc + r.total, 0) : 0,
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

// @desc    Get all devices across all users
// @route   GET /api/admin/devices
// @access  Private/Admin
export const getAllDevices = async (req, res) => {
    try {
        const users = await User.find({}, 'uid email displayName devices');

        // Fetch all pending OTPs
        const pendingOTPs = await DeviceOTP.find({});
        const otpMap = {};
        pendingOTPs.forEach(otpDoc => {
            otpMap[`${otpDoc.userId.toString()}-${otpDoc.deviceId}`] = otpDoc.otp;
        });

        let allDevices = [];
        for (const user of users) {
            for (const device of user.devices) {
                const pendingOtp = otpMap[`${user._id.toString()}-${device.deviceId}`] || null;
                allDevices.push({
                    userId: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    pendingOtp,
                    ...device.toObject()
                });
            }
        }

        // Sort by lastLoginAt descending
        allDevices.sort((a, b) => new Date(b.lastLoginAt) - new Date(a.lastLoginAt));

        res.json(allDevices);
    } catch (error) {
        console.error("Admin Get Devices Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get suspicious logins
// @route   GET /api/admin/suspicious-logins
// @access  Private/Admin
export const getSuspiciousLogins = async (req, res) => {
    try {
        // Find users with suspicious devices
        const users = await User.find({ 'devices.suspicious': true }, 'uid email displayName devices');

        // Fetch all pending OTPs
        const pendingOTPs = await DeviceOTP.find({});
        const otpMap = {};
        pendingOTPs.forEach(otpDoc => {
            otpMap[`${otpDoc.userId.toString()}-${otpDoc.deviceId}`] = otpDoc.otp;
        });

        let suspiciousDevices = [];
        for (const user of users) {
            const sDevices = user.devices.filter(d => d.suspicious === true);
            for (const device of sDevices) {
                const pendingOtp = otpMap[`${user._id.toString()}-${device.deviceId}`] || null;
                suspiciousDevices.push({
                    userId: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    pendingOtp,
                    ...device.toObject()
                });
            }
        }


        res.json(suspiciousDevices);
    } catch (error) {
        console.error("Admin Get Suspicious Logins Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings/platform
// @access  Private/Admin
export const getPlatformSettings = async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Firebase DB not initialized" });
        const settingsDoc = await db.collection("settings").doc("platform").get();
        res.json(settingsDoc.exists ? settingsDoc.data() : { maintenance: false });
    } catch (error) {
        console.error("Get Platform Settings Error:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};

// @desc    Update platform settings
// @route   PATCH /api/admin/settings/platform
// @access  Private/Admin
export const updatePlatformSettings = async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: "Firebase DB not initialized" });
        const { maintenance, maintenanceMessage } = req.body;
        
        await db.collection("settings").doc("platform").set({
            maintenance: !!maintenance,
            maintenanceMessage: maintenanceMessage || "We are currently performing scheduled maintenance.",
            updatedAt: new Date().toISOString()
        }, { merge: true });

        res.json({ success: true, maintenance: !!maintenance });
    } catch (error) {
        console.error("Update Platform Settings Error:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
};
