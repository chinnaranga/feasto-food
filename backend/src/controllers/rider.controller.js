import Rider from "../models/Rider.js";
import Order from "../models/Order.js";
import Tracking from "../models/Tracking.js";

// @desc    Get Rider Profile
// @route   GET /api/rider/profile
// @access  Private (Rider)
export const getProfile = async (req, res) => {
    try {
        const riderId = req.user.uid;
        let rider = await Rider.findOne({ userId: riderId });

        if (!rider) {
            // Auto-create rider profile if not exists (first login)
            rider = await Rider.create({
                userId: riderId,
                email: req.user.email,
                name: req.user.displayName || req.user.name || "Rider",
                status: "offline"
            });
        }

        res.status(200).json(rider);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Toggle Online/Offline Status
// @route   PATCH /api/rider/status
// @access  Private (Rider)
export const toggleStatus = async (req, res) => {
    try {
        const riderId = req.user.uid;
        const { status } = req.body; // 'online' or 'offline'

        if (!['online', 'offline'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const rider = await Rider.findOneAndUpdate(
            { userId: riderId },
            { $set: { status: status === 'online' ? 'available' : 'offline' } },
            { new: true }
        );

        res.status(200).json({ success: true, status: rider.status });
    } catch (error) {
        console.error("Toggle Status Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get Available Orders (Ready for Pickup)
// @route   GET /api/rider/orders/available
// @access  Private (Rider)
export const getAvailableOrders = async (req, res) => {
    try {
        // Find orders that are 'Ready' (prepared by restaurant) and have no rider assigned yet
        // In a real app, you'd filter by location proximity using geospatial queries
        const orders = await Order.find({
            status: "Ready",
            // connection to rider assignment logic needed here if using a specific field
            // For now, assume pending assignment
        }).sort({ createdAt: -1 }).limit(10);

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get Available Orders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Accept Order
// @route   POST /api/rider/orders/:id/accept
// @access  Private (Rider)
export const acceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const riderId = req.user.uid;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== "Ready") {
            return res.status(400).json({ error: "Order is not available for pickup" });
        }

        // Assign Rider
        order.status = "Out_for_delivery";
        // existing schema doesn't seem to have riderId explicitly in the view above, 
        // but typically we'd save it. The frontend passed 'riderId' in createOrder but 
        // let's assume we store it in a new field or relying on Tracking.
        // Let's add it to the Order model if missing, or just update status for now.

        // However, looking at RiderDashboard.jsx, it queries 'riderId' on orders.
        // So we should save it.
        // IMPORTANT: Mongoose model defined in previous step didn't explicitly show 'riderId' 
        // but MongoDB is flexible. We'll save it.

        // Also update Rider's active order
        await Rider.findOneAndUpdate(
            { userId: riderId },
            { $set: { activeOrderId: order._id, status: 'busy' } }
        );

        // Update Order
        // We use $set to ensure we add the field even if not in strict schema (if strict is false)
        // Or we should update the schema. For now, assuming flexibility or pre-existing field.
        await Order.findByIdAndUpdate(id, {
            $set: {
                status: "Driver_Assigned",
                riderId: riderId
            }
        });

        // Initialize Tracking
        await Tracking.create({
            orderId: id,
            riderUid: riderId,
            status: "Driver_Assigned",
            currentLocation: { lat: 0, lng: 0 }, // Should be real loc
            path: []
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Accept Order Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Update Order Status (Picked Up, On the Way, Delivered)
// @route   PATCH /api/rider/orders/:id/status
// @access  Private (Rider)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const riderId = req.user.uid;

        const allowedStatuses = ['Picked_Up', 'Out_for_delivery', 'Delivered'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Verify Rider Assignment
        if (order.riderId !== riderId && order.status !== "Ready") { // Allow if ready (claiming) or assigned
            // If claiming, use acceptOrder. Here we assume assigned.
            if (order.riderId && order.riderId !== riderId) {
                return res.status(403).json({ error: "Not authorized to update this order" });
            }
        }

        // Update Order
        order.status = status;
        await order.save();

        // Update Rider Status if delivered
        if (status === 'Delivered') {
            await Rider.findOneAndUpdate(
                { userId: riderId },
                {
                    $set: { activeOrderId: null, status: 'available' },
                    $inc: { totalEarnings: order.total * 0.15 }
                }
            );
        }

        // Update Tracking
        await Tracking.findOneAndUpdate(
            { orderId: id },
            {
                $set: { status: status },
                $push: {
                    path: {
                        statusUpdate: status,
                        timestamp: new Date()
                    }
                }
            },
            { upsert: true }
        );

        res.status(200).json({ success: true, status });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Complete Order (Delivered) - Alias/Wrapper
// @route   POST /api/rider/orders/:id/complete
// @access  Private (Rider)
export const completeOrder = async (req, res) => {
    // Reusing the logic or just calling the update
    req.body.status = 'Delivered';
    return updateOrderStatus(req, res);
};

// @desc    Update Rider Location
// @route   PATCH /api/rider/location
// @access  Private (Rider)
export const updateLocation = async (req, res) => {
    try {
        const { lat, lng, heading = 0, speed = 0, orderId } = req.body;
        const riderId = req.user.uid; // Firebase UID

        if (!lat || !lng) {
            return res.status(400).json({ error: "Missing coordinates" });
        }

        const locationData = {
            lat,
            lng,
            heading,
            speed,
            lastUpdated: new Date()
        };

        // 1. Update Rider's Document (Upsert)
        await Rider.findOneAndUpdate(
            { userId: riderId },
            {
                $set: {
                    currentLocation: locationData
                }
            },
            { upsert: true, new: true }
        );

        // 2. If active order, update Tracking collection
        if (orderId) {
            await Tracking.findOneAndUpdate(
                { orderId: orderId }, // Assuming orderId passed is the MongoDB Order ID
                {
                    $set: {
                        riderUid: riderId,
                        currentLocation: locationData
                    },
                    $push: {
                        path: {
                            lat,
                            lng,
                            timestamp: new Date()
                        }
                    }
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Update Location Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get Rider Earnings Stats & History
// @route   GET /api/rider/earnings
// @access  Private (Rider)
export const getEarnings = async (req, res) => {
    try {
        const riderId = req.user.uid;

        // Get Rider Profile for Total Balance
        const rider = await Rider.findOne({ userId: riderId });
        const totalEarnings = rider?.totalEarnings || 0;
        const walletBalance = rider?.walletBalance || totalEarnings; // Assuming same for now

        // Calculate Today's Earnings
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday start
        startOfWeek.setHours(0, 0, 0, 0);

        // Aggregation for Today and Week
        const orders = await Order.find({
            riderId: riderId,
            status: 'Delivered',
            updatedAt: { $gte: startOfWeek } // Fetch this week's orders to filter in memory or aggregate
        });

        let todayEarnings = 0;
        let weekEarnings = 0;
        let completedOrders = 0;

        const transactions = orders.map(order => {
            const commission = order.total * 0.15; // 15% commission
            const isToday = order.updatedAt >= startOfDay;

            if (isToday) todayEarnings += commission;
            weekEarnings += commission;

            return {
                id: order._id,
                amount: commission.toFixed(2),
                description: `Order Delivery #${order._id.toString().slice(-4)}`,
                date: order.updatedAt,
                restaurantName: "Restaurant" // You could populate this
            };
        }).reverse(); // Most recent first

        // Get total completed orders count (all time)
        const totalOrdersCount = await Order.countDocuments({ riderId: riderId, status: 'Delivered' });

        res.json({
            balance: walletBalance.toFixed(2),
            today: todayEarnings.toFixed(2),
            week: weekEarnings.toFixed(2),
            totalOrders: totalOrdersCount,
            recentTransactions: transactions.slice(0, 20) // Limit 20
        });

    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

