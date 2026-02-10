import Order from "../models/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, total, walletUsed, onlinePaid, paymentMethod, provider, transactionId, deliveryAddress, deliveryOption } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No order items" });
        }

        const order = new Order({
            userId: req.user.uid,
            restaurantId: items[0]?.restaurantId || null,
            items,
            total,
            walletUsed: walletUsed || 0,
            onlinePaid: onlinePaid || 0,
            paymentMethod,
            provider,
            transactionId,
            deliveryAddress,
            deliveryOption,
            status: onlinePaid > 0 ? "Paid" : "Pending"
        });

        const createdOrder = await order.save();

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
