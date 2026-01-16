import { db } from "../config/firebase.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, total, walletUsed, onlinePaid, paymentMethod, provider, transactionId, deliveryOption } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No order items" });
        }

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderData = {
            id: orderId,
            userId: req.user.uid, // From authMiddleware
            items,
            total,
            walletUsed: walletUsed || 0,
            onlinePaid: onlinePaid || 0,
            paymentMethod,
            provider,
            transactionId,
            deliveryOption,
            status: onlinePaid > 0 ? "Paid" : "Pending",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        const batch = db.batch();
        batch.set(db.collection("orders").doc(orderId), orderData);

        // If you need to deduct wallet or update other stats, add to batch here
        // e.g. batch.update(db.collection("users").doc(req.user.uid), { wallet: ... });

        await batch.commit();

        res.status(201).json(orderData);

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
        // Query Firestore: orders where userId == req.user.uid
        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef.where('userId', '==', req.user.uid).orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            return res.json([]);
        }

        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
