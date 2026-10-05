import mongoose from 'mongoose';

const deviceOTPSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete document after 5 minutes (300 seconds)
});

export default mongoose.model('DeviceOTP', deviceOTPSchema);
