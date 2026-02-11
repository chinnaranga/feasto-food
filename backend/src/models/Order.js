import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true
    },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        restaurantId: String
    }],
    total: {
        type: Number,
        required: true
    },
    walletUsed: {
        type: Number,
        default: 0
    },
    onlinePaid: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out_for_delivery', 'Delivered', 'Cancelled', 'Paid'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    provider: {
        type: String
    },
    transactionId: {
        type: String
    },
    deliveryAddress: {
        type: Map, // Flexible structure or Object
        of: String
    },
    deliveryOption: {
        type: String,
        default: 'delivery'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Production Indexes for Performance
orderSchema.index({ userId: 1 }); // For user order queries
orderSchema.index({ createdAt: -1 }); // For sorting by date
orderSchema.index({ status: 1 }); // For filtering by status

const Order = mongoose.model("Order", orderSchema);
export default Order;
