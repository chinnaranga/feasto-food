import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['offline', 'available', 'busy'],
        default: 'offline'
    },
    currentLocation: {
        lat: Number,
        lng: Number,
        heading: Number,
        speed: Number,
        lastUpdated: Date
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    activeOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    rating: {
        type: Number,
        default: 5.0
    },
    vehicle: {
        type: String,
        default: 'Bike'
    }
}, { timestamps: true });

// Specific index for location queries if needed later (2dsphere)
riderSchema.index({ status: 1 });
riderSchema.index({ userId: 1 });

const Rider = mongoose.model("Rider", riderSchema);
export default Rider;
