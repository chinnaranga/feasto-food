import Order from "../models/Order.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import { createNotification } from "./notification.controller.js";


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, total, walletUsed, onlinePaid, paymentMethod, provider, transactionId, deliveryAddress, deliveryOption } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No order items" });
        }

        // 1. Fetch User Details for Name
        const user = await User.findOne({ uid: req.user.uid });

        // 2. Fetch Restaurant Details for Location
        const restaurantId = items[0]?.restaurantId;
        const restaurant = restaurantId ? await Restaurant.findById(restaurantId) : null;

        // 3. Prepare Location Data
        // Frontend should send deliveryAddress as object with lat/lng if available
        let custLoc = { lat: 0, lng: 0 };
        let custAddrStr = "";

        if (typeof deliveryAddress === 'object' && deliveryAddress !== null) {
            custLoc = { lat: deliveryAddress.lat || 0, lng: deliveryAddress.lng || 0 };
            custAddrStr = deliveryAddress.address || deliveryAddress.street || "";
            // Fallback: match with user addresses if lat/lng missing
            if ((!custLoc.lat || !custLoc.lng) && user && user.addresses) {
                const savedAddr = user.addresses.find(a => a.address === custAddrStr);
                if (savedAddr) {
                    custLoc = { lat: savedAddr.lat, lng: savedAddr.lng };
                }
            }
        } else {
            custAddrStr = String(deliveryAddress);
            // Try to find in user addresses
            if (user && user.addresses) {
                const savedAddr = user.addresses.find(a => a.address === custAddrStr);
                if (savedAddr) {
                    custLoc = { lat: savedAddr.lat, lng: savedAddr.lng };
                }
            }
        }

        const order = new Order({
            userId: req.user.uid,
            restaurantId: restaurantId || null,
            items,
            total,
            walletUsed: walletUsed || 0,
            onlinePaid: onlinePaid || 0,
            paymentMethod,
            provider,
            transactionId,
            deliveryAddress: typeof deliveryAddress === 'object' ? deliveryAddress : { address: deliveryAddress }, // Ensure Map/Object compatibility
            deliveryOption,
            status: onlinePaid > 0 ? "Paid" : "Pending",

            // Location Populations
            customerName: user?.displayName || "Valued Customer",
            customerAddress: custAddrStr,
            customerLocation: custLoc,
            restaurantName: restaurant?.name || "Restaurant",
            restaurantAddress: restaurant?.address || "Partner Location",
            restaurantLocation: restaurant?.location || { lat: 0, lng: 0 }
        });

        const createdOrder = await order.save();

        // Emit notification
        await createNotification(req.user.uid, {
            title: "Order Placed! 🍕",
            description: `Your order for ${order.restaurantName} has been received.`,
            type: "order",
            metadata: { orderId: createdOrder._id.toString() }
        });

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Authorization check
        if (order.userId !== req.user.uid && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to view this order" });
        }

        res.json(order);
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};
