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
        console.error("Get Menu Error:", error);
        res.status(500).json({ message: "Server error" });
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
        console.error("Toggle Status Error:", error);
        res.status(500).json({ message: "Server error" });
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
        console.error("Add Menu Item Error:", error);
        res.status(500).json({ message: "Server error" });
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
        console.error("Delete Menu Item Error:", error);
        res.status(500).json({ message: "Server error" });
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
        const restaurant = await Restaurant.findById(id).select('-ownerId -ownerEmail -__v');

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        console.error("Get Restaurant Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
