import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'promo', 'payment', 'system'],
        default: 'system'
    },
    read: {
        type: Boolean,
        default: false
    },
    metadata: {
        orderId: String,
        link: String
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
