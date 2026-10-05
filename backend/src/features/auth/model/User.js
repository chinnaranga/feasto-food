import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, unique: true },
  displayName: String,
  phoneNumber: String,
  photoURL: String,
  role: { type: String, enum: ['user', 'admin', 'rider', 'restaurant', 'restaurant_admin'], default: 'user' },
  addresses: [{
    label: String,
    address: String,
    lat: Number,
    lng: Number
  }],
  fcmToken: String, // For push notifications
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }], // List of favorite restaurant IDs
  devices: [{
    deviceId: { type: String, required: true },
    deviceName: String,
    browser: String,
    operatingSystem: String,
    ipAddress: String,
    location: String,
    firstLoginAt: { type: Date, default: Date.now },
    lastLoginAt: Date, // Kept for consistency, will replace lastLogin below
    lastLogin: Date, // Keeping this for backward compatibility temporarily
    trusted: { type: Boolean, default: false },
    suspicious: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);