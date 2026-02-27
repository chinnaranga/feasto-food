import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, unique: true },
  displayName: String,
  phoneNumber: String,
  photoURL: String,
  role: { type: String, enum: ['user', 'admin', 'rider', 'restaurant'], default: 'user' },
  addresses: [{
    label: String,
    address: String,
    lat: Number,
    lng: Number
  }],
  fcmToken: String, // For push notifications
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }] // List of favorite restaurant IDs
});

export default mongoose.model('User', userSchema);