require("dotenv").config();
const mongoose = require("mongoose");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting migration script (CommonJS)...");

// Load Service Account
const serviceAccountPath = path.resolve("service-account-key.json");
console.log("📂 Service Account Path:", serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ service-account-key.json not found!");
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
console.log("🔑 Service Account Parsed");

// Initialize Firebase
console.log("🔥 Initializing Firebase...");
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
console.log("✅ Firebase Initialized");

// Define Models manually to avoid import issues with ES Modules
const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    displayName: String,
    phoneNumber: String,
    photoURL: String,
    role: { type: String, default: 'user' },
    addresses: [{ label: String, address: String, lat: Number, lng: Number }],
    fcmToken: String
});
const User = mongoose.model('User', userSchema);

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    reviews: Number,
    time: String,
    discount: Number,
    price: String,
    deliveryFee: Number,
    verified: Boolean,
    isNewRestaurant: Boolean,
    isEcoFriendly: Boolean,
    ownerId: { type: String, required: true, index: true },
    ownerEmail: String,
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Connect and Run
const run = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log("🔌 Connecting to MongoDB:", uri ? uri.substring(0, 20) + "..." : "UNDEFINED");

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ MongoDB Connected");

        // Migrate Users
        console.log("🚀 Migrating Users...");
        const usersSnap = await db.collection("users").get();
        let uCount = 0;
        for (const doc of usersSnap.docs) {
            const data = doc.data();
            const existing = await User.findOne({ uid: doc.id });
            if (!existing) {
                await User.create({
                    uid: doc.id,
                    email: data.email,
                    displayName: data.displayName || data.name,
                    photoURL: data.photoURL,
                    role: data.role || "user",
                    phoneNumber: data.phoneNumber,
                    addresses: data.addresses || [],
                    fcmToken: data.fcmToken
                });
                uCount++;
            }
        }
        console.log(`✅ Migrated ${uCount} users.`);

        // Migrate Restaurants
        console.log("🚀 Migrating Restaurants...");
        const restSnap = await db.collection("restaurants").get();
        let rCount = 0;
        for (const doc of restSnap.docs) {
            const data = doc.data();
            const existing = await Restaurant.findOne({ ownerId: data.ownerId });
            if (!existing) {
                await Restaurant.create({
                    name: data.name,
                    cuisine: data.cuisine,
                    rating: data.rating || 0,
                    image: data.image,
                    reviews: data.reviews || 0,
                    time: data.time || "30-45 min",
                    discount: data.discount,
                    price: data.price,
                    deliveryFee: data.deliveryFee,
                    verified: data.verified,
                    isNewRestaurant: data.isNew || false,
                    isEcoFriendly: data.isEcoFriendly || false,
                    ownerId: data.ownerId,
                    ownerEmail: data.ownerEmail
                });
                rCount++;
            }
        }
        console.log(`✅ Migrated ${rCount} restaurants.`);

        console.log("🎉 Migration Complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

run();
