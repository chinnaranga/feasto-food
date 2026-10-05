import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    ipAddress: { type: String },
    location: { type: String },
    loginStatus: { type: String, enum: ['success', 'failed', 'pending_otp'], required: true },
    suspicious: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('LoginLog', loginLogSchema);
