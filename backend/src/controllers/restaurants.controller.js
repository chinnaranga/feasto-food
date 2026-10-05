import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

// @desc    Get current restaurant profile
// @route   GET /api/restaurant/me
// @access  Private (Restaurant Owner)
export const getRestaurantProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.uid) {
            console.error("❌ CRITICAL: req.user is undefined or missing uid in getRestaurantProfile");
            return res.status(401).json({ message: "Authentication failed. User not attached to request." });
        }

        console.log(`[DEBUG /me] Fetching restaurant profile for Firebase UID: ${req.user.uid}`);
        const { uid, email } = req.user;

        // Find by ownerId (preferred) or ownerEmail
        let restaurant = await Restaurant.findOne({ ownerId: uid });

        if (!restaurant && email) {
            console.log(`[DEBUG /me] No restaurant found using ownerId. Falling back to ownerEmail: ${email}`);
            restaurant = await Restaurant.findOne({ ownerEmail: email });
        }

        if (!restaurant) {
            console.log(`[DEBUG /me] 404 - No restaurant profile found in MongoDB for user ${uid}.`);
            return res.status(404).json({ message: "No restaurant profile found for this user." });
        }

        console.log(`[DEBUG /me] Successfully found restaurant: ${restaurant._id}`);
        res.json(restaurant);
    } catch (error) {
        console.error("❌ Error fetching restaurant profile (500 crash):", error);
        console.error(error.stack);
        // Expose error message to frontend to easily debug Railway issues
        res.status(500).json({
            message: "Server error in /api/restaurant/me",
            error: error.message,
            stack: error.stack
        });
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
// @desc    Get all orders for the authenticated restaurant
// @route   GET /api/restaurant/orders
// @access  Private (Restaurant Owner)
export const getRestaurantOrders = async (req, res) => {
    try {
        const { uid, email } = req.user;
        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const orders = await Order.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Get Restaurant Orders Error:", error);
        res.status(500).json({ message: "Server error fetching orders", error: error.message });
    }
};

// @desc    Get dashboard stats for the authenticated restaurant
// @route   GET /api/restaurant/stats
// @access  Private (Restaurant Owner)
export const getRestaurantStats = async (req, res) => {
    try {
        const { uid, email } = req.user;
        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const { range } = req.query; // 'weekly' or 'monthly' for charts

        // Get today's start and end dates
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Active Orders
        const activeOrdersCount = await Order.countDocuments({
            restaurantId: restaurant._id,
            status: { $in: ["pending", "preparing", "Ready", "picked_up"] }
        });

        // Today's Revenue and Customers
        const todaysOrders = await Order.find({
            restaurantId: restaurant._id,
            createdAt: { $gte: startOfToday, $lte: endOfToday },
            status: { $in: ["delivered"] }
        });

        const revenueToday = todaysOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Find unique customers today
        const uniqueCustomers = new Set(todaysOrders.map(o => o.userId?.toString()).filter(Boolean));
        const newCustomers = uniqueCustomers.size;

        // Since we don't have historical data or delivery time tracking, we'll mock the missing parts for the demonstration:
        
        // MOCK DATA for demonstration (since there's no historical data for the new DB)
        const MONTHLY_REVENUE = [
            { name: "Jan", revenue: 85000 },
            { name: "Feb", revenue: 92000 },
            { name: "Mar", revenue: 78000 },
            { name: "Apr", revenue: 105000 },
            { name: "May", revenue: 125000 },
            { name: "Jun", revenue: 140000 },
            { name: "Jul", revenue: 165000 },
            { name: "Aug", revenue: 152000 },
            { name: "Sep", revenue: 178000 },
            { name: "Oct", revenue: 195000 },
            { name: "Nov", revenue: 210000 },
            { name: "Dec", revenue: revenueToday + 20000 }, // Make latest month dynamic based on today
        ];

        const WEEKLY_REVENUE = [
            { name: "Mon", revenue: 18000 },
            { name: "Tue", revenue: 22000 },
            { name: "Wed", revenue: 19500 },
            { name: "Thu", revenue: 26000 },
            { name: "Fri", revenue: 35000 },
            { name: "Sat", revenue: 42000 },
            { name: "Sun", revenue: revenueToday + 5000 }, // Dynamic based on today
        ];

        const PEAK_HOURS = [
            { hour: "12 PM", orders: 45 },
            { hour: "1 PM", orders: 55 },
            { hour: "2 PM", orders: 60 },
            { hour: "4 PM", orders: 20 },
            { hour: "6 PM", orders: 85 },
            { hour: "7 PM", orders: 95 },
            { hour: "8 PM", orders: 120 },
            { hour: "9 PM", orders: 105 },
            { hour: "10 PM", orders: 90 },
        ];

        const TOP_ITEMS = [
            { name: "Truffle Mushroom Pizza", sales: 420, revenue: "₹3,57,000" },
            { name: "Butter Chicken", sales: 395, revenue: "₹1,58,000" },
            { name: "Paneer Tikka Masala", sales: 310, revenue: "₹93,000" },
            { name: "Spicy Dragon Chicken", sales: 285, revenue: "₹1,14,000" },
            { name: "Chocolate Lava Cake", sales: 260, revenue: "₹65,000" },
        ];

        res.json({
            revenueToday,
            activeOrders: activeOrdersCount,
            avgDeliveryTime: "32 mins",
            newCustomers,
            revenueData: range === 'weekly' ? WEEKLY_REVENUE : MONTHLY_REVENUE,
            peakHours: PEAK_HOURS,
            topItems: TOP_ITEMS
        });
    } catch (error) {
        console.error("Get Restaurant Stats Error:", error);
        res.status(500).json({ message: "Server error fetching stats", error: error.message });
    }
};

// @desc    Get restaurant menu
// @route   GET /api/restaurant/menu
// @access  Private (Restaurant Owner)
export const getMenu = async (req, res) => {
    try {
        const { uid, email } = req.user;
        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.json(restaurant.menu || []);
    } catch (error) {
        console.error("❌ Get Menu Error:", error);
        res.status(500).json({ message: "Server error fetching menu", error: error.message });
    }
};

// @desc    Update restaurant menu
// @route   PUT /api/restaurant/menu
// @access  Private (Restaurant Owner)
export const updateMenu = async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { menu } = req.body; // Expecting array of items

        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        restaurant.menu = menu;
        await restaurant.save();

        res.json(restaurant.menu);
    } catch (error) {
        console.error("Update Menu Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Toggle restaurant status (Open/Close)
// @route   POST /api/restaurant/toggle
// @access  Private (Restaurant Owner)
export const toggleRestaurantStatus = async (req, res) => {
    try {
        const { uid, email } = req.user;

        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        restaurant.isOpen = !restaurant.isOpen;
        // Sync isAvailable for simplicity, or handle separately
        restaurant.isAvailable = restaurant.isOpen;

        await restaurant.save();

        res.json({ success: true, isOpen: restaurant.isOpen, message: `Restaurant is now ${restaurant.isOpen ? 'Open' : 'Closed'}` });
    } catch (error) {
        console.error("❌ Toggle Status Error:", error);
        res.status(500).json({ message: "Server error toggling status", error: error.message });
    }
};

// @desc    Add item to menu
// @route   POST /api/restaurant/menu
// @access  Private (Restaurant Owner)
export const addMenuItem = async (req, res) => {
    try {
        const { uid, email } = req.user;
        const newItem = req.body;

        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        restaurant.menu.push(newItem);
        await restaurant.save();

        // Return the last added item (which now has an _id)
        const addedItem = restaurant.menu[restaurant.menu.length - 1];
        res.status(201).json(addedItem);
    } catch (error) {
        console.error("❌ Add Menu Item Error:", error);
        res.status(500).json({ message: "Server error adding menu item", error: error.message });
    }
};

// @desc    Delete item from menu
// @route   DELETE /api/restaurant/menu/:itemId
// @access  Private (Restaurant Owner)
export const deleteMenuItem = async (req, res) => {
    try {
        const { uid, email } = req.user;
        const { itemId } = req.params;

        let restaurant = await Restaurant.findOne({ ownerId: uid });
        if (!restaurant && email) restaurant = await Restaurant.findOne({ ownerEmail: email });

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        // Filter out the item
        restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== itemId);
        await restaurant.save();

        res.json({ success: true, message: "Item deleted" });
    } catch (error) {
        console.error("❌ Delete Menu Item Error:", error);
        res.status(500).json({ message: "Server error deleting item", error: error.message });
    }
};

// @desc    Get all restaurants (public)
// @route   GET /api/restaurant
// @access  Public
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOpen: true, isAvailable: true })
            .select('-ownerId -ownerEmail -__v');
        res.json(restaurants);
    } catch (error) {
        console.error("Get All Restaurants Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get single restaurant by ID (public)
// @route   GET /api/restaurant/:id
// @access  Public
export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid restaurant ID format" });
        }

        const restaurant = await Restaurant.findById(id).select('-ownerId -ownerEmail -__v');

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        // Safety net for any remaining CastError edge cases
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }
        console.error("Get Restaurant Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
