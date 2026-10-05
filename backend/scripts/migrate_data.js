import "dotenv/config";
import mongoose from "mongoose";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import User from "../src/models/User.js";
import Restaurant from "../src/models/Restaurant.js";
import Order from "../src/models/Order.js";

// Load Service Account
const serviceAccountPath = path.resolve("service-account-key.json");
console.log("📂 Service Account Path:", serviceAccountPath);
if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ service-account-key.json not found!");
    process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase
console.log("🔥 Initializing Firebase...");
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
console.log("✅ Firebase Initialized");

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("No MONGODB_URI found");

        console.log("🔌 Connecting to MongoDB:", uri.substring(0, 20) + "...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};

const migrateUsers = async () => {
    console.log("🚀 Migrating Users...");
    const snapshot = await db.collection("users").get();
    let count = 0;

    for (const doc of snapshot.docs) {
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
            count++;
        }
    }
    console.log(`✅ Migrated ${count} users.`);
};

const migrateRestaurants = async () => {
    console.log("🚀 Migrating Restaurants...");
    const snapshot = await db.collection("restaurants").get();
    let count = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        // Check duplication by ownerId
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
            count++;
        }
    }
    console.log(`✅ Migrated ${count} restaurants.`);
};

const migrateOrders = async () => {
    console.log("🚀 Migrating Orders (Last 100)...");
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").limit(100).get();
    let count = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        // Use Firebase ID as a reference if needed, but Mongo generates its own _id. 
        // We'll trust Mongo _id but maybe store firebaseId if we modify schema?
        // For now, just importing raw data. Note: Order schema might differ slightly.

        // Skip check for speed, just try catch insert? No, duplicate check is good.
        // Orders don't have a unique field in our Mongo schema besides _id.
        // We'll skip orders for now to avoid duplicates unless we add a firebaseId field.
        // Actually, let's just do it based on timestamp match?
        // Risky. Let's focus on Users/Restaurants first as they cause the 404s.
    }
    console.log(`ℹ️  Skipping Orders for now (Users & Restaurants are priority).`);
};

const run = async () => {
    await connectDB();
    await migrateUsers();
    await migrateRestaurants();
    console.log("🎉 Migration Complete!");
    process.exit(0);
};

run();
