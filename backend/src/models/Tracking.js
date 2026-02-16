import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true
    },
    riderId: {
        type: mongoose.Schema.Types.ObjectId, // Or String if using Firebase UID as ref manually
        ref: 'Rider'
    },
    riderUid: {
        type: String, // Firebase UID for easier lookups
        required: true
    },
    currentLocation: {
        lat: Number,
        lng: Number,
        heading: Number,
        speed: Number,
        lastUpdated: Date
    },
    path: [{
        lat: Number,
        lng: Number,
        timestamp: Date
    }],
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
}, { timestamps: true });

// TTL index to auto-delete completed tracking info after 24 hours
trackingSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
