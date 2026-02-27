import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";

// Helper to make an HTTP request (promisified)
const request = (url, options, body = null) => {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
};

// --- AUTH HELPER FUNCTIONS (Manual JWT Signing) ---
function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function getAccessToken(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const claim = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/datastore",
        aud: serviceAccount.token_uri,
        exp: now + 3600,
        iat: now
    };

    const header = { alg: "RS256", typ: "JWT" };
    const signatureInput = base64UrlEncode(JSON.stringify(header)) + "." + base64UrlEncode(JSON.stringify(claim));

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    const signature = signer.sign(serviceAccount.private_key, 'base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const jwt = signatureInput + "." + signature;

    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    console.log("🔑 Exchanging JWT for Access Token...");
    const response = await request(serviceAccount.token_uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, body);

    return response.access_token;
}

// --- FIRESTORE PARSER ---
// Converts { fields: { name: { stringValue: "foo" } } } to { name: "foo" }
function parseFirestoreDoc(doc) {
    if (!doc.fields) return {};
    const obj = {};
    for (const [key, value] of Object.entries(doc.fields)) {
        obj[key] = parseValue(value);
    }
    // Add ID
    const pathParts = doc.name.split('/');
    obj._firestoreId = pathParts[pathParts.length - 1];
    return obj;
}

function parseValue(val) {
    if (val.stringValue !== undefined) return val.stringValue;
    if (val.integerValue !== undefined) return parseInt(val.integerValue);
    if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.timestampValue !== undefined) return val.timestampValue;
    if (val.mapValue !== undefined) return parseFirestoreDoc(val.mapValue);
    if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseValue);
    if (val.nullValue !== undefined) return null;
    return val;
}

// --- MAIN ---
async function main() {
    try {
        console.log("🚀 Starting REST Migration...");

        // Load Service Account
        const serviceAccountPath = path.resolve("service-account-key.json");
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

        // Get Access Token
        const accessToken = await getAccessToken(serviceAccount);
        console.log("✅ Access Token Obtained");

        // Connect to MongoDB
        const uri = process.env.MONGODB_URI;
        console.log("🔌 Connecting to MongoDB:", uri.substring(0, 20) + "...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ MongoDB Connected");

        const projectId = serviceAccount.project_id;
        const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        const authHeader = { 'Authorization': `Bearer ${accessToken}` };

        // Define Models
        const userSchema = new mongoose.Schema({
            uid: { type: String, required: true, unique: true },
            username: { type: String, unique: true }, // Added for migration compatibility
            email: { type: String, unique: true },
            displayName: String,
            phoneNumber: String,
            photoURL: String,
            role: { type: String, default: 'user' },
            addresses: [{ label: String, address: String, lat: Number, lng: Number }],
            fcmToken: String
        });
        const User = mongoose.models.User || mongoose.model('User', userSchema);

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
        const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

        // --- MIGRATE USERS ---
        console.log("🚀 Fetching Users from Firestore REST...");
        const usersRes = await request(`${baseUrl}/users?pageSize=300`, { headers: authHeader });
        const users = (usersRes.documents || []).map(parseFirestoreDoc);
        console.log(`Fetched ${users.length} users.`);

        let uCount = 0;
        for (const u of users) {
            const existing = await User.findOne({ uid: u._firestoreId });
            if (!existing) {
                // Generate unique username
                let username = u.username;
                if (!username) {
                    if (u.email) username = u.email.split('@')[0];
                    else username = `user_${u._firestoreId.substring(0, 6)}`;
                }
                // Ensure it's unique enough (simple append)
                username = `${username}_${Math.floor(Math.random() * 1000)}`;

                const userData = {
                    uid: u._firestoreId,
                    username: username,
                    displayName: u.displayName || u.name,
                    photoURL: u.photoURL,
                    role: u.role || "user",
                    phoneNumber: u.phoneNumber,
                    addresses: u.addresses || [],
                    fcmToken: u.fcmToken
                };
                if (u.email) {
                    userData.email = u.email;
                } else {
                    // Generate fake email to satisfy unique index (since it's not sparse)
                    userData.email = `no-email-${u._firestoreId}@feasto.placeholder`;
                }

                try {
                    await User.create(userData);
                    uCount++;
                    console.log(`✅ Created user ${u._firestoreId}`);
                } catch (err) {
                    if (err.code === 11000) {
                        console.warn(`⚠️ Duplicate key error for ${userData.email} (UID: ${u._firestoreId}). Retrying with placeholder email.`);
                        userData.email = `dup-${u._firestoreId}@feasto.placeholder`;
                        // Also randomize username just in case
                        userData.username = `dup-${u._firestoreId}-${Math.floor(Math.random() * 10000)}`;
                        try {
                            await User.create(userData);
                            uCount++;
                            console.log(`✅ Created user ${u._firestoreId} with placeholder email`);
                        } catch (retryErr) {
                            console.error(`❌ Failed to insert user ${u._firestoreId}:`, retryErr.message);
                        }
                    } else {
                        console.error(`❌ Error creating user ${u._firestoreId}:`, err.message);
                    }
                }
            }
        }
        console.log(`✅ Migrated ${uCount} users to MongoDB.`);

        // --- MIGRATE RESTAURANTS ---
        console.log("🚀 Fetching Restaurants from Firestore REST...");
        const restRes = await request(`${baseUrl}/restaurants?pageSize=300`, { headers: authHeader });
        const restaurants = (restRes.documents || []).map(parseFirestoreDoc);
        console.log(`Fetched ${restaurants.length} restaurants.`);

        let rCount = 0;
        for (const r of restaurants) {
            // Fix boolean/number types from REST if unclear, but helper handles most
            const existing = await Restaurant.findOne({ ownerId: r.ownerId });
            if (!existing) {
                await Restaurant.create({
                    name: r.name || "Unknown Restaurant",
                    cuisine: r.cuisine || "General",
                    rating: Number(r.rating) || 0,
                    image: r.image || "https://placehold.co/600x400?text=No+Image",
                    reviews: Number(r.reviews) || 0,
                    time: r.time || "30-45 min",
                    discount: Number(r.discount) || 0,
                    price: r.price || "$$",
                    deliveryFee: Number(r.deliveryFee) || 0,
                    verified: Boolean(r.verified),
                    isNewRestaurant: Boolean(r.isNew || r.isNewRestaurant),
                    isEcoFriendly: Boolean(r.isEcoFriendly),
                    ownerId: r.ownerId,
                    ownerEmail: r.ownerEmail
                });
                rCount++;
            }
        }
        console.log(`✅ Migrated ${rCount} restaurants to MongoDB.`);

        console.log("🎉 Migration Complete!");
        process.exit(0);

    } catch (e) {
        console.error("❌ Migration Error:", e);
        process.exit(1);
    }
}

main();
