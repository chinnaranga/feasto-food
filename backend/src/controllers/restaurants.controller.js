import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

// @desc    Get current restaurant profile
// @route   GET /api/restaurant/me
// @access  Private (Restaurant Owner)
export const getRestaurantProfile = async (req, res) => {
    try {
        const { uid, email } = req.user;

        // Find by ownerId (preferred) or ownerEmail
        let restaurant = await Restaurant.findOne({ ownerId: uid });

        if (!restaurant && email) {
            restaurant = await Restaurant.findOne({ ownerEmail: email });
        }

        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant profile found for this user." });
        }

        res.json(restaurant);
    } catch (error) {
        console.error("Error fetching restaurant profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update order status
// @route   PATCH /api/restaurant/orders/:orderId/status
// @access  Private (Restaurant Owner)
export const updateRestaurantOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const { uid, email } = req.user;

        if (!status) return res.status(400).json({ message: "Status is required" });

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verify ownership
        // 1. Get user's restaurant
        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) {
            restaurant = await Restaurant.findOne({ ownerEmail: email });
        }

        if (!restaurant) {
            return res.status(403).json({ message: "Unauthorized: You do not own a restaurant" });
        }

        // 2. Check match
        if (order.restaurantId && order.restaurantId.toString() !== restaurant._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Order does not belong to your restaurant" });
        }

        order.status = status;
        await order.save();

        res.json({ success: true, message: "Order status updated", order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error" });
    }
};
